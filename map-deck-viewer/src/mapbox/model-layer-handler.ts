import { featureCollection } from "@turf/helpers";
import type { FeatureCollection, Point } from "geojson";
import type { Map as MapboxMap } from "mapbox-gl";
import type { Model } from "../types/model-type";

export class ModelLayerHandler {
	public readonly id: string;

	public amount: number;

	constructor(
		private readonly map: MapboxMap,
		private readonly model: Model,
	) {
		this.id = model.id;
		this.amount = model.amount;

		// Add to map
		this.addSource();
		this.addModel();
		this.addLayer();
	}

	private addModel() {
		this.map.addModel(this.id, URL.createObjectURL(this.model.file));
	}

	private addSource() {
		this.map.addSource(this.id, {
			type: "geojson",
			data: featureCollection([]),
		});
	}

	private addLayer() {
		this.map.addLayer({
			id: this.id,
			type: "model",
			layout: {
				"model-id": this.id,
			},
			source: this.id,
		});
	}

	public updateSource(features: FeatureCollection<Point>) {
		const source = this.map.getSource(this.id);
		if (source && source.type === "geojson") {
			source.setData(features);
		}
	}

	public remove() {
		this.map.removeLayer(this.id);
		this.map.removeModel(this.id);
		this.map.removeSource(this.id);
	}
}
