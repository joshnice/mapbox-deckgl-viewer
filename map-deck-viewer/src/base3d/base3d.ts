import { Mapbox } from "../mapbox/mapbox";
import type { DeckGlSubjects } from "../types/deckgl-types";

export abstract class Base3d {
	public readonly mapbox: Mapbox;

	public modelsAmount: Record<string, number> = {};

	constructor(options: { mapbox: Mapbox; subjects: DeckGlSubjects }) {
		this.mapbox = options.mapbox;
	}

	public addLayers(models: Record<string, File>): Promise<void> {
		Object.keys(models).forEach((model) => {
			this.modelsAmount[model] = 1;
		});
		return Promise.resolve();
	}

	public abstract removeLayer(): void;

	public abstract validationTesting(models: Record<string, File>): Promise<Record<string, boolean>>;

	public changeModelAmount(id: string, amount: number) {
		this.modelsAmount[id] = amount;
	}

	public createCoordinates(): [number, number][] {
		const data: [number, number][] = [];
		const totalAmount = Object.values(this.modelsAmount).reduce((sum, val) => (sum += val), 0);
		const columnsAndRows = Math.floor(Math.sqrt(totalAmount));
		const halfColumnAndRows = columnsAndRows / 2;

		for (let modelIndex = 0; modelIndex < totalAmount; modelIndex += 1) {
			const row = Math.floor(modelIndex / columnsAndRows);
			const column = modelIndex % columnsAndRows;
			const longIncrement = (row - halfColumnAndRows) / 10000;
			const latIncrement = (column - halfColumnAndRows) / 10000;
			data.push([longIncrement, latIncrement]);
		}

		return data;
	}
}
