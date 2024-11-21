import { MapboxOverlay } from "@deck.gl/mapbox";
import { ScenegraphLayer } from "deck.gl";
import { load } from "@loaders.gl/core";
import { GLTFLoader } from "@loaders.gl/gltf";
import { Mapbox } from "../mapbox/mapbox";
import type { DeckGlSubjects, Stats } from "../types/deckgl-types";
import { Base3d } from "../base3d/base3d";
import { firstValueFrom } from "rxjs";

export class DeckGl extends Base3d {
	private modelLayers: ScenegraphLayer[] = [];

	private mapboxOverlay: MapboxOverlay | null = null;

	private loadedModels: Record<string, any> = {};

	private readonly $onModelFailedToLoad: DeckGlSubjects["$onModelFailedToLoad"];

	private readonly $renderingSceneFinished: DeckGlSubjects["$renderingSceneFinshed"];

	private readonly $onModelStatsFinished: DeckGlSubjects["$onModelStatsFinished"];

	private startLoadingModel: number = 0;

	private stats: Stats | null = null;

	private singleModel: boolean = true;

	constructor(options: { mapbox: Mapbox; subjects: DeckGlSubjects }) {
		super(options);
		this.$onModelFailedToLoad = options.subjects.$onModelFailedToLoad;
		this.$renderingSceneFinished = options.subjects.$renderingSceneFinshed;
		this.$onModelStatsFinished = options.subjects.$onModelStatsFinished;
		this.events(options.subjects);
	}

	public override async addLayers(models: Record<string, File>) {
		await super.addLayers(models);

		this.singleModel = Object.keys(models).length === 1;

		const coords = this.createCoordinates();

		const modelsWithId = Object.entries(models);
		for (let i = 0; i < modelsWithId.length; i++) {
			const modelWithId = modelsWithId[i];
			if (modelWithId == null) {
				throw new Error();
			}

			const [modelId, modelFile] = modelWithId;

			if (modelFile == null) {
				throw new Error();
			}

			let error = false;
			this.startLoadingModel = performance.now();
			try {
				this.loadedModels[modelId] = await load(modelFile, GLTFLoader);
			} catch (err: any) {
				error = true;
				if ("message" in err) {
					this.$onModelFailedToLoad.next(err.message);
				}
			}

			if (error) {
				return;
			}

			if (this.singleModel) {
				this.getStats(modelFile.name, this.loadedModels[modelId]);
			}

			const modelCoord = coords[i];

			if (modelCoord == null) {
				throw new Error();
			}

			this.modelLayers?.push(this.createModelLayer(modelId, [{ coords: modelCoord }]));
		}

		this.mapboxOverlay = new MapboxOverlay({
			interleaved: true,
			layers: this.modelLayers,
		});

		this.mapbox.getMap().addControl(this.mapboxOverlay);
		await firstValueFrom(this.$renderingSceneFinished);
		console.log("rendering finished");
	}

	public removeLayer() {
		if (this.mapboxOverlay != null) {
			this.mapboxOverlay.setProps({
				layers: [],
			});

			this.modelLayers = [];

			this.mapboxOverlay.finalize();

			this.mapbox.getMap().removeControl(this.mapboxOverlay);

			this.stats = null;

			this.modelsAmount = {};
		}
	}

	public override changeModelAmount(id: string, amount: number) {
		super.changeModelAmount(id, amount);

		const allCoords = this.createCoordinates();
		let totalAmountCoordsUsed = 0;
		const layers: ScenegraphLayer[] = [];

		Object.entries(this.modelsAmount).forEach(([modelId, modelAmount]) => {
			const data: { coords: [number, number] }[] = allCoords.slice(totalAmountCoordsUsed, totalAmountCoordsUsed + modelAmount).map((coords) => ({ coords }))
			totalAmountCoordsUsed += modelAmount;
			layers.push(this.createModelLayer(modelId, data));
		});

		try {
			this.mapboxOverlay?.setProps({
				layers,
			});
		} catch (err) {
			console.error("err", err);
		}
	}

	private createModelLayer(id: string, data: { coords: [number, number] }[]) {
		return new ScenegraphLayer({
			id,
			type: ScenegraphLayer,
			scenegraph: this.loadedModels[id],
			getScene: (scenegraph) => {
				const finishRenderingScene = performance.now();
				const totalRenderingTimeSecs = (finishRenderingScene - this.startLoadingModel) / 1000;
				this.$renderingSceneFinished.next(totalRenderingTimeSecs);
				return scenegraph && scenegraph.scenes ? scenegraph.scenes[0] : scenegraph;
			},
			data,
			sizeScale: 1,
			getPosition: (d: { coords: [number, number] }) => d.coords,
			getOrientation: () => [0, 0, 90],
			_lighting: "pbr",
		});
	}

	private events(subjects: DeckGlSubjects) {
		luma.log.warn = (warning: string) => () => {
			console.warn(warning);
			subjects.$onLumaGlWarning.next(warning);
		};
	}

	private getStats(modelName: string, model: any) {
		this.stats = {
			name: modelName.split(".glb")[0] ?? "	",
			sizeMb: Number.parseFloat((model.buffers[0].byteLength / 1048576).toFixed(2)),
			accessor: model.json.accessors.length,
			material: model.json.materials.length,
			mesh: model.json.meshes.length,
			nodes: model.json.nodes.length,
		}
		this.$onModelStatsFinished.next(this.stats);
	}
}
