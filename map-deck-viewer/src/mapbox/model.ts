import type { Map } from "mapbox-gl";
import type { ModelFeatureCollection } from "./mapbox-types";

export class ModelLayer {

    public readonly id: string;

    private readonly map: Map;

    private readonly getModelFile: (modelId: string) => File;

    private readonly getFeatureCollection: (layerId: string) => ModelFeatureCollection;

    constructor(config: { map: Map, id: string,  }, operations: { getModelFile: (modelId: string) => File, getFeatureCollection: (sourceId: string) => ModelFeatureCollection }) {
        this.map = config.map;
        this.id = config.id;

        this.getModelFile = operations.getModelFile;
        this.getFeatureCollection = operations.getFeatureCollection;

        this.addModel();
    }

    public removeModel() {
        // Remove source, layer and model
        this.map.removeSource(this.id);
        this.map.removeLayer(this.id);
        this.map.removeModel(this.id); 
    }

    private addModel() {
        // Add GLB file
        const modelFile = this.getModelFile(this.id);
        this.map.addModel(this.id, URL.createObjectURL(modelFile));

        // Add source
        this.map.addSource(this.id, { type: "geojson", data: this.getFeatureCollection(this.id) });

        // Add layer
        this.map.addLayer({
            id: this.id,
            type: "model",
            layout: {
                "model-id": this.id
            },
            source: this.id
        })
    }
}