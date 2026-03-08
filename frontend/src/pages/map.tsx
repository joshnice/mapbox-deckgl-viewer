import {
	MapHandlerComponent,
	type MapHandlerForwardRefProps,
} from "@joshnice/map-deck-viewer";
import { useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map.css";
import { ModelDropZoneComponent } from "./components/model-dropzone";

const MAPBOX_ACCESS_TOKEN =
	"pk.eyJ1Ijoiam9zaG5pY2U5OCIsImEiOiJjanlrMnYwd2IwOWMwM29vcnQ2aWIwamw2In0.RRsdQF3s2hQ6qK-7BH5cKg";

export function MapComponent() {
	const mapHandlerRef = useRef<MapHandlerForwardRefProps | null>(null);
	const [hasModels, setHasModels] = useState(false);

	const handleModelsAdded = (modelFiles: FileList) => {
		for (const modelFile of modelFiles) {
			mapHandlerRef.current?.addModel({
				id: crypto.randomUUID(),
				file: modelFile,
				amount: 1,
			});
			if (hasModels === false) {
				setHasModels(true);
			}
		}
		mapHandlerRef.current?.updateModelPositions();
	};

	return (
		<ModelDropZoneComponent
			hasModels={hasModels}
			handleModelFileDropped={handleModelsAdded}
		>
			<MapHandlerComponent
				mapboxAccessKey={MAPBOX_ACCESS_TOKEN}
				ref={mapHandlerRef}
			/>
		</ModelDropZoneComponent>
	);
}
