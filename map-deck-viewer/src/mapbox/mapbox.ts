import { Map } from "mapbox-gl";
import { Subject } from "rxjs";
import { FpsCounter } from "../utils/fps";

export class Mapbox {
	private map: Map | null = null;

	private readonly $testing: Subject<boolean>;

	private readonly $testingResult: Subject<{ modelId: string; result: number }>;

	private fps = new FpsCounter();

	private readonly startPosition: { center: [number, number]; zoom: number; pitch: number; bearing: number } = {
		center: [0, 0],
		zoom: 20,
		pitch: 60,
		bearing: 0,
	};

	constructor(options: {
		container: HTMLDivElement;
		subjects: { $testing: Subject<boolean>; $testingResult: Subject<{ modelId: string; result: number }> };
	}) {
		this.createMap(options.container);
		this.$testing = options.subjects.$testing;
		this.$testingResult = options.subjects.$testingResult;
	}

	private createMap(container: HTMLDivElement) {
		this.map = new Map({
			container: container,
			style: {
				version: 8,
				layers: [
					{ id: "background", type: "background", paint: { "background-color": "#cccccc" } },
					{ id: "sky", type: "sky" },
				],
				sources: {},
			},
			center: this.startPosition.center,
			zoom: this.startPosition.zoom,
			pitch: this.startPosition.pitch,
			interactive: false,
		});
		this.enableInteraction();
	}

	public getMap() {
		if (this.map == null) {
			throw new Error("Map has not been created");
		}

		return this.map;
	}

	public async startTesting(modelId: string) {
		this.disableInteraction();
		this.map?.flyTo({
			bearing: this.startPosition.bearing,
			center: this.startPosition.center,
			zoom: this.startPosition.zoom,
			pitch: this.startPosition.pitch,
			duration: 0,
			essential: true,
		});
		this.$testing.next(true);
		this.fps.start();

		for (let bearing = 0; bearing < 361; bearing += 10) {
			this.map?.flyTo({ bearing, duration: 300, essential: true });
			await new Promise<void>((res) => {
				this.map?.once("idle", () => {
					res();
				});
			});
		}
		this.$testing.next(false);
		const results = this.fps.finish();
		this.$testingResult.next({ result: results, modelId });
		this.enableInteraction();
	}

	public setZoomLevel(zoomLevel: number) {
		this.startPosition.zoom = zoomLevel;
	}

	public resetPosition() {
		this.map?.flyTo({
			bearing: this.startPosition.bearing,
			center: this.startPosition.center,
			zoom: this.startPosition.zoom,
			pitch: this.startPosition.pitch,
			duration: 0,
			essential: true,
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
