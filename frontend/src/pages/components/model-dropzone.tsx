import { type DragEvent, type PropsWithChildren, useState } from "react";
import { DropHint } from "./drop-hint";
import "./model-dropzone.css";

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
	const [unsupportedFileDropped, setUnsupportedFileDropped] = useState(false);

	const isSupportedModelFile = (file: File) => {
		const fileName = file.name.toLowerCase();
		return fileName.endsWith(".glb") || file.type === "model/gltf-binary";
	};

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
			const supportedFiles = Array.from(modelFiles).filter(isSupportedModelFile);
			setUnsupportedFileDropped(supportedFiles.length !== modelFiles.length);
			if (supportedFiles.length > 0) {
				const filteredModelFiles = new DataTransfer();
				for (const file of supportedFiles) {
					filteredModelFiles.items.add(file);
				}
				handleModelFileDropped(filteredModelFiles.files);
			}
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
			{!hasModels && (
				<DropHint
					isDraggingModel={isDraggingModel}
					unsupportedFileDropped={unsupportedFileDropped}
				/>
			)}
		</div>
	);
}
