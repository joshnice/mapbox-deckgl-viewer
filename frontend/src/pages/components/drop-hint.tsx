import "./drop-hint.css";

interface DropHintProps {
	isDraggingModel: boolean;
	unsupportedFileDropped: boolean;
}

export function DropHint({
	isDraggingModel,
	unsupportedFileDropped,
}: DropHintProps) {
	return (
		<div className="drop-hint">
			<p className="drop-hint__title">
				{isDraggingModel
					? "Drop files to add them on the map"
					: "Drag and drop model files onto the map"}
			</p>
			<p className="drop-hint__subtitle">
				Supports glb model format
			</p>
			{unsupportedFileDropped && (
				<p className="drop-hint__error">
					Unsupported file type. Please drop a .glb file.
				</p>
			)}
		</div>
	);
}
