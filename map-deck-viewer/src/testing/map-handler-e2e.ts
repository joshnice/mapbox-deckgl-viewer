/** biome-ignore-all lint/suspicious/noExplicitAny: Testing file */
import type { Map as MapboxMap } from "mapbox-gl";
import { MAP_HANDLER_TEST_FN_ID } from "./map-handler-e2e-constants";

export class MapHandlerE2e {
	constructor(private map: MapboxMap) {
		if ((window as any).playwright) {
			this.attachFunctionsToWindow();
		}
	}

	getAllMapFeatures() {
		return this.map.queryRenderedFeatures();
	}

	private attachFunctionsToWindow() {
		(window as any)[MAP_HANDLER_TEST_FN_ID] = {
			getAllMapFeatures: () => this.getAllMapFeatures(),
		};
	}
}
