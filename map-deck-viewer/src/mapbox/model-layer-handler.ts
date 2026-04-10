import { featureCollection } from "@turf/helpers";
import type { FeatureCollection, Point } from "geojson";
import type { Map as MapboxMap } from "mapbox-gl";
import type { GlbModel } from "../types/model-type";

export class ModelLayerHandler {
	public readonly id: string;

	public amount: number;

	private readonly modelFile: File;

	private readonly startTime: number;

	public totalRenderingTime: number | null = null;

	private readonly timeBetweenRenderChecksMs = 5;

	constructor(
		private readonly map: MapboxMap,
		model: GlbModel,
	) {
		this.id = model.id;
		this.amount = model.amount;
		this.modelFile = model.file;

		this.startTime = performance.now();
		this.checkForRenderedModel();

		// Add to map
		this.addSource();
		this.addModel();
		this.addLayer();
	}

	private addModel() {
		this.map.addModel(this.id, URL.createObjectURL(this.modelFile));
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
				"model-allow-density-reduction": false,
			},
			metadata: {
				modelName: this.modelFile.name,
			},
			source: this.id,
		});
	}

	private checkForRenderedModel() {
		let intervalId: NodeJS.Timeout;
		intervalId = setInterval(() => {
			const features = this.map.queryRenderedFeatures();
			const foundLayerFeature = features.some(
				(f) => (f.properties as { layerId: string }).layerId === this.id,
			);
			if (foundLayerFeature) {
				this.totalRenderingTime = performance.now() - this.startTime;
				window.clearInterval(intervalId);
			}
		}, this.timeBetweenRenderChecksMs);
	}

	public updateSource(features: FeatureCollection<Point>) {
		const source = this.map.getSource(this.id);
		if (source && source.type === "geojson") {
			source.setData(features);
		}
	}

	public updateAmount(amount: number) {
		this.amount = amount;
	}

	public remove() {
		this.map.removeLayer(this.id);
		this.map.removeModel(this.id);
		this.map.removeSource(this.id);
	}
}
