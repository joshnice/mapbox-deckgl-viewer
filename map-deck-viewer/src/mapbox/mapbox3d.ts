import type { FeatureCollection, Feature, Point } from "geojson";
import { Base3d } from "../base3d/base3d";
import type { ModelLayerSpecification } from "mapbox-gl";

export class Mapbox3d extends Base3d {
	public override addLayers(models: Record<string, File>): Promise<void> {
		super.addLayers(models);
		const map = this.mapbox.getMap();
		const coords = this.createCoordinates();

		const modelsWithId = Object.entries(models);

		for (let i = 0; i < Object.keys(models).length; i++) {
			const modelWithId = modelsWithId[i];

			if (modelWithId == null) {
				throw new Error();
			}

			const [modelId, model] = modelWithId;

			if (model == null) {
				throw new Error();
			}

			map.addModel(modelId, URL.createObjectURL(model));

			const coordinates = coords[i];

			if (coordinates == null) {
				throw new Error();
			}

			const source: FeatureCollection = {
				type: "FeatureCollection",
				features: [{ type: "Feature", geometry: { coordinates, type: "Point" }, properties: {} }],
			};

			map.addSource(modelId, { type: "geojson", data: source });

			const modelLayer: ModelLayerSpecification = {
				id: modelId,
				type: "model",
				layout: {
					"model-id": modelId,
				},
				source: modelId,
			};

			map.addLayer(modelLayer);
		}

		return Promise.resolve();
	}

	public override removeLayer(): void {
		const map = this.mapbox.getMap();
		Object.keys(this.modelsAmount).forEach((modelId) => {
			map.removeLayer(modelId);
			map.removeSource(modelId);
		});
	}

	public override changeModelAmount(id: string, amount: number): void {
		super.changeModelAmount(id, amount);
		const map = this.mapbox.getMap();
		let totalCoordsUsed = 0;
		const coords = this.createCoordinates();
		Object.entries(this.modelsAmount).forEach(([modelId, modelAmount]) => {
			const source = map.getSource(modelId);

			if (source?.type === "geojson") {
				const modelCoords = coords.slice(totalCoordsUsed, modelAmount + totalCoordsUsed);

				const features: Feature<Point>[] = modelCoords.map((coord) => ({
					type: "Feature",
					geometry: { coordinates: [coord[0], coord[1]], type: "Point" },
					properties: {},
				}));

				totalCoordsUsed += features.length;

				const updatedData: FeatureCollection = {
					type: "FeatureCollection",
					features,
				};

				source.setData(updatedData);
			}
		});
	}

	public override async validationTesting(models: Record<string, File>): Promise<void> {
		this.removeLayer();

		const map = this.mapbox.getMap();

		const source: FeatureCollection = {
			type: "FeatureCollection",
			features: [{ type: "Feature", geometry: { type: "Point", coordinates: [0, 0] }, properties: {} }],
		};

		for (const [modelId, file] of Object.entries(models)) {
			try {
				map.addSource(modelId, { type: "geojson", data: source });
				map.addModel(modelId, URL.createObjectURL(file));
				map.addLayer({
					id: modelId,
					type: "model",
					source: modelId,
					layout: {
						"model-id": modelId,
					},
				});

				await new Promise<void>((res) => {
					map.once("idle", () => {
						const features = map.queryRenderedFeatures();
						console.log(features);
						res();
					});
				});
			} catch (err) {
				console.error(err);
			}
			if (map.getLayer(modelId)) {
				map.removeLayer(modelId);
			}
			if (map.getSource(modelId)) {
				map.removeSource(modelId);
			}
		}
	}
}
