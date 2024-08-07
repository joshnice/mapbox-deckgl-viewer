import { MapboxOverlay } from "@deck.gl/mapbox";
import { ScenegraphLayer } from "deck.gl";
import { load } from "@loaders.gl/core";
import { GLTFLoader } from "@loaders.gl/gltf";
import { Mapbox } from "../mapbox/mapbox";
import type { DeckGlSubjects } from "../types/deckgl-types";

export class DeckGl {
	private readonly mapbox: Mapbox;

	private modelLayer: ScenegraphLayer | null = null;

	private mapboxOverlay: MapboxOverlay | null = null;

	private model: any | null = null;

	private testing: boolean = false;

	private fpsValues: number[] = [];

	private readonly $onModelFailedToLoad: DeckGlSubjects["$onModelFailedToLoad"];

	private readonly $renderingSceneFinshed: DeckGlSubjects["$renderingSceneFinshed"];

	private startLoadingModel: number = 0;

	constructor(options: { mapbox: Mapbox; subjects: DeckGlSubjects }) {
		this.mapbox = options.mapbox;
		this.$onModelFailedToLoad = options.subjects.$onModelFailedToLoad;
		this.$renderingSceneFinshed = options.subjects.$renderingSceneFinshed;
		this.events(options.subjects);
	}

	public async addLayer(model: File) {
		let error = false;
		this.startLoadingModel = performance.now();
		try {
			this.model = await load(model, GLTFLoader);
		} catch (err: any) {
			error = true;
			if ("message" in err) {
				this.$onModelFailedToLoad.next(err.message);
			}
		}

		if (error) {
			return;
		}

		console.log(this.model);

		this.modelLayer = this.createModelLayer([{ coords: [0, 0] }]);
		this.mapboxOverlay = new MapboxOverlay({
			interleaved: true,
			_onMetrics: (metrics: { fps: number }) => {
				if (this.testing) {
					this.fpsValues.push(metrics.fps);
				}
			},
			layers: [this.modelLayer],
		});

		this.mapbox.getMap().addControl(this.mapboxOverlay);
	}

	public removeLayer() {
		if (this.mapboxOverlay != null) {
			this.mapboxOverlay.setProps({
				layers: [],
			});

			this.mapboxOverlay.finalize();

			this.mapbox.getMap().removeControl(this.mapboxOverlay);
		}
	}

	public changeModelAmount(amount: number) {
		const data: { coords: [number, number] }[] = [];
		const columnsAndRows = Math.floor(Math.sqrt(amount));
		const halfColumnAndRows = columnsAndRows / 2;

		for (let modelIndex = 0; modelIndex < amount; modelIndex += 1) {
			const row = Math.floor(modelIndex / columnsAndRows);
			const column = modelIndex % columnsAndRows;
			const longIncrement = (row - halfColumnAndRows) / 10000;
			const latIncrement = (column - halfColumnAndRows) / 10000;
			data.push({ coords: [longIncrement, latIncrement] });
		}

		try {
			this.mapboxOverlay?.setProps({
				layers: [this.createModelLayer(data)],
			});
		} catch (err) {
			console.error("err", err);
		}
	}

	private createModelLayer(data: { coords: [number, number] }[]) {
		return new ScenegraphLayer({
			id: "model-layer",
			type: ScenegraphLayer,
			scenegraph: this.model,
			getScene: (scenegraph) => {
				const finishRenderingScene = performance.now();
				const totalRenderingTimeSecs = (finishRenderingScene - this.startLoadingModel) / 1000;
				this.$renderingSceneFinshed.next(totalRenderingTimeSecs);
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
		subjects.$testing.subscribe((value) => {
			if (!value) {
				subjects.$testingResults.next(this.fpsValues);
				this.fpsValues = [];
			}
			this.testing = value;
		});

		luma.log.warn = (warning: string) => () => {
			subjects.$onLumaGlWarning.next(warning);
		};
	}
}
