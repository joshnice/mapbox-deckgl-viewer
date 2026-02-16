// import mapboxgl from "mapbox-gl";
// import type { FeatureCollection } from "geojson";
// import { ReplaySubject, Subject } from "rxjs";
// import { Mapbox } from "./mapbox/mapbox";
// import type { EngineType, MapDeckViewOptions, MapDeckViewerSubjects } from "./types/map-deck-viewer-types";
// import type { Stats } from "./types/deckgl-types";
// import { Mapbox3d } from "./mapbox/mapbox3d";
// import { DeckGl } from "./deckgl/deckgl";
// import type { Base3d } from "./base3d/base3d";
// import { createCSV, downloadBlob } from "./utils/csv";
// import { generateGridGeoJSON } from "./utils/generate-grid-points";

// export class MapModelViewer {
// 	private readonly mapbox: Mapbox;

// 	private map3d: Base3d | null = null;

// 	private subjects: MapDeckViewerSubjects;

// 	private models: Record<string, File> = {};

// 	private results: Record<string, number> = {};

// 	private validationResults: Record<string, boolean> = {};

// 	constructor(options: MapDeckViewOptions) {
// 		if (options.mapboxAccessKey == null) {
// 			throw new Error("Mapbox access key needs to be present");
// 		}

// 		mapboxgl.accessToken = options.mapboxAccessKey;

// 		if (options.mapElement == null) {
// 			throw new Error("Map element needs to be present");
// 		}

// 		this.subjects = this.verifySubjects(options.subjects);

// 		this.mapbox = new Mapbox({ container: options.mapElement, subjects: this.subjects });
// 	}

// 	public async addModels(models: Record<string, File>) {



// 		this.models = models;
// 		await this.map3d?.addLayers(models);
// 	}

// 	public removeModel() {
// 		this.map3d?.removeLayer();
// 	}

// 	public async startTesting(singleModelTest: boolean, modelAmount: number) {
// 		if (!singleModelTest) {
// 			this.mapbox.startTesting("single");
// 			return;
// 		}

// 		this.results = {};

// 		const rows = Math.round(Math.sqrt(modelAmount));
// 		const cols = Math.round(Math.sqrt(modelAmount));

// 		const features = generateGridGeoJSON({ rows, cols, spacing: 0.0001 })
// 		for (const [modelId, modelFile] of Object.entries(this.models)) {
// 			await this.testSingleModel(features, modelId, modelFile);
// 		}

// 		createCSV(Object.entries(this.results), ["model name", "avg fps"], "Model testing results");
// 	}

// 	public async startValidtionTesting() {
// 		const results = await this.map3d?.validationTesting(this.models);
// 		if (results == null) {
// 			throw new Error("Results for validation was null, something went wrong");
// 		}
// 		this.validationResults = results;
// 		downloadBlob(JSON.stringify(this.validationResults), "validation-results", "json");
// 	}

// 	private async testSingleModel(features: FeatureCollection, modelId: string, modelFile: File) {
// 		this.removeModel();
// 		this.mapbox.setSource(modelId, features);
// 		this.mapbox.addLayer(modelId, modelFile);
// 		this.mapbox.startTesting(modelId);
// 		return new Promise<void>((resolve) => {
// 			const sub = this.subjects.$testingResult.subscribe(({ result }) => {
// 				this.results[modelId] = Number.parseFloat(result.toFixed(2));
// 				sub.unsubscribe();
// 				resolve();
// 			});
// 		});
// 	}

// 	public changeModelAmount(id: string, amount: number) {
// 		this.map3d?.changeModelAmount(id, amount);
// 	}

// 	public setZoomLevel(zoomLevel: number) {
// 		this.mapbox.setZoomLevel(zoomLevel);
// 	}

// 	private verifySubjects(subjects: MapDeckViewOptions["subjects"] = {}) {
// 		const {
// 			$onLumaGlWarning,
// 			$onModelFailedToLoad,
// 			$renderingSceneFinished,
// 			$testing,
// 			$testingResult,
// 			$onModelStatsFinished,
// 			$validationTesting,
// 		} = subjects;
// 		return {
// 			$onLumaGlWarning: $onLumaGlWarning ?? new ReplaySubject<string>(),
// 			$onModelFailedToLoad: $onModelFailedToLoad ?? new ReplaySubject<string>(),
// 			$renderingSceneFinished: $renderingSceneFinished ?? new ReplaySubject<number>(),
// 			$testing: $testing ?? new Subject<boolean>(),
// 			$testingResult: $testingResult ?? new Subject<{ modelId: string; result: number }>(),
// 			$onModelStatsFinished: $onModelStatsFinished ?? new ReplaySubject<Stats>(),
// 			$validationTesting: $validationTesting ?? new Subject<boolean>(),
// 		};
// 	}
// }
