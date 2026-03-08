/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import {
	type MapHandlerForwardRefProps,
	MapHandlerComponent,
} from "@joshnice/map-deck-viewer";
import { useRef, useState, type DragEvent } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map.css";
import { DropHint } from "./components/drop-hint";

const MAPBOX_ACCESS_TOKEN =
	"pk.eyJ1Ijoiam9zaG5pY2U5OCIsImEiOiJjanlrMnYwd2IwOWMwM29vcnQ2aWIwamw2In0.RRsdQF3s2hQ6qK-7BH5cKg";

export function MapCompnent() {
	const mapHandlerRef = useRef<MapHandlerForwardRefProps | null>(null);
	const dragDepthRef = useRef(0);
	const [isDraggingModel, setIsDraggingModel] = useState(false);
	const [hasModels, setHasModels] = useState(false);

	const handleModelInput = async (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		dragDepthRef.current = 0;
		setIsDraggingModel(false);
		const modelFiles = event.dataTransfer.files;
		if (modelFiles.length > 0) {
			setHasModels(true);
		}
		for (const modelFile of modelFiles) {
			mapHandlerRef.current?.addModel({
				id: crypto.randomUUID(),
				file: modelFile,
				amount: 1,
			});
		}
		mapHandlerRef.current?.updateModelPositions();
	};

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDraggingModel(true);
	};

	const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		dragDepthRef.current += 1;
		setIsDraggingModel(true);
	};

	const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
		if (dragDepthRef.current === 0) {
			setIsDraggingModel(false);
		}
	};

	return (
		<div
			className={`map-container${isDraggingModel ? " map-container--dragging" : ""}`}
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleModelInput}
		>
      <MapHandlerComponent
        mapboxAccessKey={MAPBOX_ACCESS_TOKEN}
        ref={mapHandlerRef}
      />
      {!hasModels ? <DropHint isDraggingModel={isDraggingModel} /> : null}
    </div>
  );
}
