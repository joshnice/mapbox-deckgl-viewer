import { bbox } from "@turf/bbox";
import { bboxPolygon } from "@turf/bbox-polygon";
import booleanWithin from "@turf/boolean-within";
import { featureCollection } from "@turf/helpers";
import mapboxgl, {
	Map as MapboxMap,
	type MapOptions,
	type StyleSpecification,
} from "mapbox-gl";
import type { Model } from "../types/model-type";
import { generateGridGeoJSON } from "../utils/generate-grid-points";
import { ModelLayerHandler } from "./model-layer-handler";

const STARTING_MAP_POSTIION: Partial<MapOptions> = {
	center: [0, 0],
	zoom: 20,
	pitch: 60,
	bearing: 0,
};

const MAP_STYLE: StyleSpecification = {
	version: 8,
	layers: [
		{
			id: "background",
			type: "background",
			paint: { "background-color": "#cccccc" },
		},
		{ id: "sky", type: "sky" },
	],
	sources: {},
};

export class MapHandler {
	private map: MapboxMap;

	private layers: ModelLayerHandler[] = [];

	constructor(config: { container: HTMLDivElement; mapboxAccessKey: string }) {
		mapboxgl.accessToken = config.mapboxAccessKey;

		this.map = new MapboxMap({
			container: config.container,
			interactive: false,
			style: MAP_STYLE,
			...STARTING_MAP_POSTIION,
		});

		this.enableInteraction();
	}

	public addModel(model: Model) {
		this.layers.push(new ModelLayerHandler(this.map, model));
	}

	public updateModelPositions() {
		const gridFeatures = generateGridGeoJSON(
			this.layers.map(({ id, amount }) => ({ layerId: id, amount })),
		);

		for (const layer of this.layers) {
			const features = gridFeatures.features.filter(
				(f) => f.properties.layerId === layer.id,
			);
			layer.updateSource(featureCollection(features));
		}

		const currentBounds = this.map.getBounds()?.toArray().flat() as [
			number,
			number,
			number,
			number,
		];
		const boundsPolygon = bboxPolygon(currentBounds);

		const canSeeAllFeatures = gridFeatures.features.every((f) =>
			booleanWithin(f, boundsPolygon),
		);

		if (!canSeeAllFeatures) {
			this.map.fitBounds(
				bbox(gridFeatures) as [number, number, number, number],
				{
					duration: 500,
					pitch: STARTING_MAP_POSTIION.pitch,
					padding: 100,
				},
			);
		}
	}

	private enableInteraction() {
		this.map?.dragPan.enable();
		this.map?.dragRotate.enable();
		this.map?.scrollZoom.enable();
		this.map?.keyboard.enable();
	}

	// private disableInteraction() {
	//     this.map?.dragPan.disable();
	//     this.map?.dragRotate.disable();
	//     this.map?.scrollZoom.disable();
	//     this.map?.keyboard.disable();
	// }
}
