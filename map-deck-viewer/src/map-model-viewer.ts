import mapboxgl from "mapbox-gl";
import { ReplaySubject, Subject } from "rxjs";
import { Mapbox } from "./mapbox/mapbox";
import type { EngineType, MapDeckViewOptions, MapDeckViewerSubjects } from "./types/map-deck-viewer-types";
import type { Stats } from "./types/deckgl-types";
import { Mapbox3d } from "./mapbox/mapbox3d";
import { DeckGl } from "./deckgl/deckgl";
import type { Base3d } from "./base3d/base3d";
import { createCSV } from "./utils/csv";

export class MapModelViewer {
	private readonly mapbox: Mapbox;

	private map3d: Base3d | null = null;

	private subjects: MapDeckViewerSubjects;

	private models: Record<string, File> = {};

	private results: Record<string, number> = {};

	// private validationResults: Record<string, number> = {};

	constructor(options: MapDeckViewOptions) {
		if (options.mapboxAccessKey == null) {
			throw new Error("Mapbox access key needs to be present");
		}

		mapboxgl.accessToken = options.mapboxAccessKey;

		if (options.mapElement == null) {
			throw new Error("Map element needs to be present");
		}

		this.subjects = this.verifySubjects(options.subjects);

		this.mapbox = new Mapbox({ container: options.mapElement, subjects: this.subjects });
	}

	public setEngine(engine: EngineType) {
		if (engine === "deckgl") {
			this.map3d = new DeckGl({ mapbox: this.mapbox, subjects: this.subjects });
		}

		if (engine === "mapbox") {
			this.map3d = new Mapbox3d({ mapbox: this.mapbox, subjects: this.subjects });
		}
	}

	public async addModels(models: Record<string, File>) {
		this.models = models;
		await this.map3d?.addLayers(models);
	}

	public removeModel() {
		this.map3d?.removeLayer();
	}

	public async startTesting(singleModelTest: boolean, modelAmount: number) {
		if (!singleModelTest) {
			this.mapbox.startTesting("single");
			return;
		}

		this.results = {};

		for (const [modelId, modelFile] of Object.entries(this.models)) {
			await this.testSingleModel(modelAmount, modelId, modelFile);
		}

		createCSV(Object.entries(this.results), ["model name", "avg fps"], "Model testing results");
	}

	public async startValidtionTesting() {
		// this.validationResults = {};
		this.map3d?.validationTesting(this.models);
	}

	private async testSingleModel(modelAmount: number, modelId: string, modelFile: File) {
		this.removeModel();
		await this.map3d?.addLayers({ [modelId]: modelFile });
		this.changeModelAmount(modelId, modelAmount);
		this.mapbox.startTesting(modelId);
		return new Promise<void>((resolve) => {
			const sub = this.subjects.$testingResult.subscribe(({ result }) => {
				this.results[modelId] = Number.parseFloat(result.toFixed(2));
				sub.unsubscribe();
				resolve();
			});
		});
	}

	public changeModelAmount(id: string, amount: number) {
		this.map3d?.changeModelAmount(id, amount);
	}

	public setZoomLevel(zoomLevel: number) {
		this.mapbox.setZoomLevel(zoomLevel);
	}

	private verifySubjects(subjects: MapDeckViewOptions["subjects"] = {}) {
		const {
			$onLumaGlWarning,
			$onModelFailedToLoad,
			$renderingSceneFinished,
			$testing,
			$testingResult,
			$onModelStatsFinished,
			$validationTesting,
		} = subjects;
		return {
			$onLumaGlWarning: $onLumaGlWarning ?? new ReplaySubject<string>(),
			$onModelFailedToLoad: $onModelFailedToLoad ?? new ReplaySubject<string>(),
			$renderingSceneFinished: $renderingSceneFinished ?? new ReplaySubject<number>(),
			$testing: $testing ?? new Subject<boolean>(),
			$testingResult: $testingResult ?? new Subject<{ modelId: string; result: number }>(),
			$onModelStatsFinished: $onModelStatsFinished ?? new ReplaySubject<Stats>(),
			$validationTesting: $validationTesting ?? new Subject<boolean>(),
		};
	}
}
