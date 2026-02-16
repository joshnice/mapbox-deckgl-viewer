import type { FeatureCollection, Point } from "geojson";

export type ModelFeatureCollection = FeatureCollection<Point, { layerId: string}>