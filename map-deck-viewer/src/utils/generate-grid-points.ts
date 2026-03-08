import { featureCollection, point } from "@turf/helpers";
import type {
	ModelFeature,
	ModelFeatureCollection,
} from "../types/features-type";

interface GridConfig {
	spacing?: number;
}

/**
 * Generate a GeoJSON FeatureCollection of points in a grid centered at [0, 0]
 * Creates points for each layer based on the specified amount
 */
export function generateGridGeoJSON(
	layers: { layerId: string; amount: number }[],
	config: GridConfig = {},
): ModelFeatureCollection {
	const { spacing = 0.0005 } = config;
	const features: ModelFeature[] = [];

	const totalPoints = layers.reduce((sum, { amount }) => {
		return sum + Math.max(0, amount);
	}, 0);

	if (totalPoints === 0) {
		return featureCollection(features);
	}

	// Build one shared grid so different layers do not overlap at [0, 0].
	const gridSize = Math.ceil(Math.sqrt(totalPoints));
	const xOffset = ((gridSize - 1) * spacing) / 2;
	const yOffset = ((gridSize - 1) * spacing) / 2;

	let globalPointIndex = 0;
	for (const { layerId, amount } of layers) {
		const count = Math.max(0, amount);

		for (let i = 0; i < count; i++) {
			const row = Math.floor(globalPointIndex / gridSize);
			const col = globalPointIndex % gridSize;
			const x = col * spacing - xOffset;
			const y = row * spacing - yOffset;
			features.push(point([x, y], { layerId }));
			globalPointIndex++;
		}
	}

	return featureCollection(features);
}
