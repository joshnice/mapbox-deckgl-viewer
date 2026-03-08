import {
	MapHandlerComponent,
	type MapHandlerForwardRefProps,
} from "@joshnice/map-deck-viewer";
import { useRef, useState } from "react";
import type { Model } from "@joshnice/map-deck-viewer/src/types/model-type";
import { ModelDropZoneComponent } from "./components/model-dropzone";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map.css";
import { SettingsComponent } from "./components/settings";

const MAPBOX_ACCESS_TOKEN =
	"pk.eyJ1Ijoiam9zaG5pY2U5OCIsImEiOiJjanlrMnYwd2IwOWMwM29vcnQ2aWIwamw2In0.RRsdQF3s2hQ6qK-7BH5cKg";

export function MapComponent() {
	const mapHandlerRef = useRef<MapHandlerForwardRefProps | null>(null);
	const [models, setModels] = useState<Model[]>([]);

	const handleModelsAdded = (modelFiles: FileList) => {
		for (const modelFile of modelFiles) {
			const model = {
				id: crypto.randomUUID(),
				file: modelFile,
				amount: 1,
			};
			mapHandlerRef.current?.addModel(model);
			setModels((m) => [...m, model]);
		}
		mapHandlerRef.current?.updateModelPositions();
	};

	const handleModelAmountChanged = (modelAmount: Pick<Model, "id" | "amount">) => {
		setModels((currentModels) =>
			currentModels.map((model) =>
				model.id === modelAmount.id
					? {
							...model,
							amount: modelAmount.amount,
						}
					: model,
			),
		);
		mapHandlerRef.current?.updateModelAmount(modelAmount);
	};

	return (
		<ModelDropZoneComponent
			hasModels={models.length > 0}
			handleModelFileDropped={handleModelsAdded}
		>
			<SettingsComponent
				models={models}
				onModelAmountChanged={handleModelAmountChanged}
			/>
			<MapHandlerComponent
				mapboxAccessKey={MAPBOX_ACCESS_TOKEN}
				ref={mapHandlerRef}
			/>
		</ModelDropZoneComponent>
	);
}
