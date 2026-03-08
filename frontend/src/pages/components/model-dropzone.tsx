import { type DragEvent, type PropsWithChildren, useState } from "react";
import { DropHint } from "./drop-hint";

interface ModelDropZoneProps {
	hasModels: boolean;
	handleModelFileDropped: (modelFile: FileList) => void;
}

export function ModelDropZoneComponent({
	hasModels,
	handleModelFileDropped,
	children,
}: PropsWithChildren<ModelDropZoneProps>) {
	const [isDraggingModel, setIsDraggingModel] = useState(false);

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDraggingModel(true);
	};

	const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDraggingModel(true);
	};

	const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDraggingModel(false);
	};

	const handleModelInput = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDraggingModel(false);
		const modelFiles = event.dataTransfer.files;
		if (modelFiles.length > 0) {
			handleModelFileDropped(modelFiles);
		}
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Can replace with input layer
		<div
			className={`map-container${isDraggingModel ? " map-container--dragging" : ""}`}
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleModelInput}
		>
			{children}
			{!hasModels && <DropHint isDraggingModel={isDraggingModel} />}
		</div>
	);
}
