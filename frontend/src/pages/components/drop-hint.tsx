import "./drop-hint.css";

interface DropHintProps {
	isDraggingModel: boolean;
}

export function DropHint({ isDraggingModel }: DropHintProps) {
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
		</div>
	);
}
