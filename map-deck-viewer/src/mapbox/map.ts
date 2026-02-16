import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import { ModelLayer } from "./model";
import type { FeatureCollection, Feature, Point } from "geojson";
import type { ModelFeatureCollection } from "./mapbox-types";
import { generateGridGeoJSON } from "../utils/generate-grid-points";

export class Map {

    private readonly center: [number, number] = [0, 0];

    private zoom = 20;

    private pitch = 60;

    private bearing = 0;

    private map: MapboxMap;

    private models: { id: string, model: File }[] = [];

    private modelLayers: ModelLayer[] = [];

    private modelFeatures: FeatureCollection<Point, { layerId: string }> = { type: "FeatureCollection", features: []};

    constructor(config: { container: HTMLDivElement, mapboxAccessKey: string }) {

        mapboxgl.accessToken = config.mapboxAccessKey;

		this.map = new MapboxMap({
			container: config.container,
			style: {
				version: 8,
				layers: [
					{ id: "background", type: "background", paint: { "background-color": "#cccccc" } },
					{ id: "sky", type: "sky" },
				],
				sources: {},
			},
			center: this.center,
			zoom: this.zoom,
			pitch: this.pitch,
            bearing: this.bearing,
			interactive: false,
		});
        
		this.enableInteraction();
	}


    // Public accessors

    public addModelToMap(id: string) {
        const newModelLayer = new ModelLayer({ map: this.map, id }, { getModelFile: this.getModel.bind(this), getFeatureCollection: this.getFeatureCollectionForLayer.bind(this) });
        this.modelLayers.push(newModelLayer);
    }

    public removeModelFromMap(id: string) {
        const modelLayer = this.modelLayers.find((layer) => layer.id === id);
        modelLayer?.removeModel();
    }

    public addModel(model: {id: string, model: File}) {
        this.models.push(model);
    }

    public addModels(models: {id: string, model: File}[]) {
        this.models.push(...models);
    }

    public generateFeatures(config: {id: string, amount: number}[]) {
        const id = config[0]?.id as string;
        const gridFeatures = generateGridGeoJSON({ cols: config.length, rows: 1, layerId: id });
        this.modelFeatures = gridFeatures as ModelFeatureCollection;
    }

    private getModel(modelId: string) {
        const foundModel = this.models.find((m) => m.id === modelId);

        if (foundModel == null) {
            throw new Error(`Model with Id ${modelId} has not been added`);
        }

        return foundModel.model;
    }

    private getFeatureCollectionForLayer(layerId: string): ModelFeatureCollection {
        const layerFeatures: Feature<Point, { layerId: string }>[] = [];

        for (const feature of this.modelFeatures.features) {
            if (feature.properties.layerId === layerId) {
                layerFeatures.push(feature);
            }
        }

        return { type: "FeatureCollection", features: layerFeatures };
        
    }

	private enableInteraction() {
		this.map?.dragPan.enable();
		this.map?.dragRotate.enable();
		this.map?.scrollZoom.enable();
		this.map?.keyboard.enable();
	}

	private disableInteraction() {
		this.map?.dragPan.disable();
		this.map?.dragRotate.disable();
		this.map?.scrollZoom.disable();
		this.map?.keyboard.disable();
    }
}