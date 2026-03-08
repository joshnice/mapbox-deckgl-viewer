import type { StyleSpecification, MapOptions } from "mapbox-gl";

export const STARTING_MAP_POSTIION: Partial<MapOptions> = {
	center: [0, 0],
	zoom: 20,
	pitch: 60,
	bearing: 0,
};

export const MAP_STYLE: StyleSpecification = {
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

export const TESTING_STEP_DURATION = 1000;

export const TESTING_BEARING_INCREMENT = 1000;
