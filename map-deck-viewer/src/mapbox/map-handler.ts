import { bbox } from "@turf/bbox";
import { bboxPolygon } from "@turf/bbox-polygon";
import booleanWithin from "@turf/boolean-within";
import { featureCollection } from "@turf/helpers";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import type { Model } from "../types/model-type";
import { generateGridGeoJSON } from "../utils/generate-grid-points";
import { ModelLayerHandler } from "./model-layer-handler";
import {
	MAP_STYLE,
	STARTING_MAP_POSTIION,
	TESTING_BEARING_INCREMENT,
	TESTING_STEP_DURATION,
} from "./map-handler-constants";
import { FpsCounter } from "../utils/fps";

export class MapHandler {
	private map: MapboxMap;

	private modelLayers: ModelLayerHandler[] = [];

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
		this.modelLayers.push(new ModelLayerHandler(this.map, model));
	}

	public async updateModelPositions() {
		const gridFeatures = generateGridGeoJSON(
			this.modelLayers.map(({ id, amount }) => ({ layerId: id, amount })),
		);

		for (const layer of this.modelLayers) {
			const features = gridFeatures.features.filter(
				(f) => f.properties.layerId === layer.id,
			);
			layer.updateSource(featureCollection(features));
		}

		await new Promise<void>((res) => {
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
				this.map.once("idle", () => {
					res();
				});

				this.map.fitBounds(
					bbox(gridFeatures) as [number, number, number, number],
					{
						duration: 500,
						pitch: STARTING_MAP_POSTIION.pitch,
						padding: 100,
					},
				);
			} else {
				res();
			}
		});
	}

	public async changeModelAmount(modelAmount: Pick<Model, "id" | "amount">) {
		const layer = this.modelLayers.find((layer) => layer.id === modelAmount.id);
		if (layer == null) {
			throw new Error(`Layer with id '${modelAmount.id}' not found`);
		}
		layer.updateAmount(modelAmount.amount);
		await this.updateModelPositions();
	}

	public async startTesting() {
		this.disableInteraction();

		const fpsCounter = new FpsCounter();

		fpsCounter.start();

		for (
			let bearing = TESTING_BEARING_INCREMENT;
			bearing <= 360;
			bearing += TESTING_BEARING_INCREMENT
		) {
			await this.moveCameraForTesting(bearing, TESTING_STEP_DURATION);
		}

		const averageFPS = fpsCounter.finish();

		this.enableInteraction();

		return averageFPS;
	}

	private async moveCameraForTesting(bearing: number, duration: number) {
		return new Promise<void>((res) => {
			setTimeout(() => {
				res();
			}, duration);
			this.map.easeTo({ bearing, duration });
		});
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
