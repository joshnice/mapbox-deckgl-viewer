import { Tiles3DLoader } from "@loaders.gl/3d-tiles";
import { Tile3DLayer as DeckglTile3DLayer } from "@deck.gl/geo-layers";
import type { Tile3DModel } from "../types/model-type";
import type { DeckglMapboxOverlay } from "./deckgl-mapbox-overlay";

export class Tile3DLayer {
	constructor(
		model: Tile3DModel,
		private readonly deckglMapboxOverlay: DeckglMapboxOverlay,
		onTilesetLoad: (position: { lng: number; lat: number }) => void,
	) {
		console.log("Tile3DLayer");
		const layer = new DeckglTile3DLayer({
			id: model.id,
			data: "local-tileset",
			loader: Tiles3DLoader,
			loadOptions: {
				"3d-tiles": {
					isTileset: true,
				},
				fetch: (url: string) => {
					if (url === "local-tileset") {
						const file = model.files.find(
							(file) => file.name === "tileset.json",
						);
						console.log("file", file);
						return Promise.resolve(file);
					}
					const file = model.files.find(
						(file) => file.name === url.replace("/", ""),
					);
					return Promise.resolve(file);
				},
			},
			onTilesetLoad: (tileset) => {
				console.log(tileset);
				const pos = {
					lng: tileset.cartographicCenter?.x ?? 0,
					lat: tileset.cartographicCenter?.y ?? 0,
				};
				onTilesetLoad(pos);
			},
		});

		this.deckglMapboxOverlay.addLayer(layer);
	}
}
