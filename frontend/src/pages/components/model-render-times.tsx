import { faClock, faRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { IconActionButton } from "./icon-action-button";
import "./model-render-times.css";

interface ModelRenderTime {
	id: string;
	name: string;
	renderTime: number | null;
}

interface ModelRenderTimesProps {
	disabled: boolean;
	isOpen: boolean;
	onGetModelRenderTimes: () => Promise<ModelRenderTime[]>;
	onToggle: () => void;
}

function formatRenderTime(renderTime: number | null) {
	if (renderTime == null) {
		return "--";
	}

	return `${renderTime.toFixed(2)} ms`;
}

export function ModelRenderTimesComponent({
	disabled,
	isOpen,
	onGetModelRenderTimes,
	onToggle,
}: ModelRenderTimesProps) {
	const [rows, setRows] = useState<ModelRenderTime[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleRefresh = async () => {
		setIsLoading(true);
		try {
			const modelRenderTimes = await onGetModelRenderTimes();
			setRows(modelRenderTimes);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (isOpen && !disabled) {
			handleRefresh();
		}
	}, [isOpen, disabled]);

	return (
		<div className="model-render-times">
			<IconActionButton
				ariaLabel="Open model render times"
				className="model-render-times__button"
				disabled={disabled}
				isExpanded={isOpen}
				onClick={onToggle}
			>
				<FontAwesomeIcon className="model-render-times__icon" icon={faClock} />
			</IconActionButton>
			{isOpen && !disabled && (
				<section
					className="model-render-times__panel"
					aria-label="Model render times panel"
				>
					<div className="model-render-times__header">
						<h3 className="model-render-times__title">Render Times</h3>
						<button
							aria-label="Refresh render times"
							className="model-render-times__refresh"
							disabled={isLoading}
							onClick={handleRefresh}
							type="button"
						>
							<FontAwesomeIcon icon={faRotate} />
						</button>
					</div>
					{rows.length === 0 && (
						<p className="model-render-times__state">
							{isLoading ? "Loading render times..." : "No models to show."}
						</p>
					)}
					{rows.length > 0 && (
						<div className="model-render-times__table-wrapper">
							<table className="model-render-times__table">
								<thead>
									<tr>
										<th>Model</th>
										<th>Render Time</th>
									</tr>
								</thead>
								<tbody>
									{rows.map((row) => (
										<tr key={row.id}>
											<td>{row.name}</td>
											<td>{formatRenderTime(row.renderTime)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</section>
			)}
		</div>
	);
}
