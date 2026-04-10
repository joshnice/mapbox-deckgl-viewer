import type { Tile3DLayer } from "@deck.gl/geo-layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import type { Map as MapboxMap } from "mapbox-gl";

export class DeckglMapboxOverlay {
	private mapboxOverlay: MapboxOverlay | null = null;

	constructor(mapboxMap: MapboxMap) {
		mapboxMap.once("idle", () => {
			this.mapboxOverlay = new MapboxOverlay({
				interleaved: true,
				layers: [],
			});
			mapboxMap.addControl(this.mapboxOverlay);
		});
	}

	public addLayer(layer: Tile3DLayer) {
		this.mapboxOverlay?.setProps({
			layers: [layer],
		});
	}
}
