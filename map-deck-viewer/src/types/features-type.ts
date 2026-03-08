import type { Feature, FeatureCollection, Point } from "geojson";

export type ModelFeature = Feature<Point, { layerId: string }>;

export type ModelFeatureCollection = FeatureCollection<
	Point,
	ModelFeature["properties"]
>;
