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

	const isGlbFile = (file: File) => {
		const fileName = file.name.toLowerCase();
		return fileName.endsWith(".glb") || file.type === "model/gltf-binary";
	};

	const isTilesetJsonFile = (file: File) => file.name.toLowerCase() === "tileset.json";

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
			const files = Array.from(modelFiles);
			const hasTilesetJson = files.some(isTilesetJsonFile);
			const glbFiles = files.filter(isGlbFile);
			const has3DTilesBundle = hasTilesetJson && glbFiles.length > 0;

			const supportedFiles = has3DTilesBundle
				? files.filter((file) => isGlbFile(file) || isTilesetJsonFile(file))
				: files.filter(isGlbFile);

			setUnsupportedFileDropped(
				has3DTilesBundle
					? files.some(
							(file) => !isGlbFile(file) && !isTilesetJsonFile(file),
						)
					: supportedFiles.length !== files.length,
			);
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
