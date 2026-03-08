import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { TestResultRenderTime } from "../../types/test-result-type";

interface ResultRenderTimeItemProps {
	result: TestResultRenderTime;
	runNumber: number;
	timestamp: string;
	onOpenDetails: () => void;
}

export function ResultRenderTimeItem({
	result,
	runNumber,
	timestamp,
	onOpenDetails,
}: ResultRenderTimeItemProps) {
	const averageRenderTime =
		result.models.length === 0
			? 0
			: result.models.reduce((total, model) => total + model.renderTime, 0) /
				result.models.length;

	return (
		<article className="results__item">
			<div className="results__item-head">
				<div className="results__item-meta">
					<div className="results__run-row">
						<p className="results__run">Run #{runNumber}</p>
						<span className="results__type">Render Time</span>
					</div>
					<p className="results__time">{timestamp}</p>
				</div>
				<button
					aria-label={`View details for run #${runNumber}`}
					className="results__info-button"
					onClick={onOpenDetails}
					type="button"
				>
					<FontAwesomeIcon className="results__info-icon" icon={faCircleInfo} />
				</button>
			</div>
			<p className="results__fps">
				<span className="results__label">Average Render Time</span>
				<span className="results__value">{averageRenderTime.toFixed(2)}</span>
			</p>
		</article>
	);
}

interface ResultRenderTimeDetailsProps {
	result: TestResultRenderTime;
}

export function ResultRenderTimeDetails({
	result,
}: ResultRenderTimeDetailsProps) {
	return (
		<ul className="results__models-list">
			{result.models.map((model) => (
				<li className="results__models-item" key={`${result.id}-${model.id}`}>
					<span className="results__models-name">{model.name}</span>
					<span className="results__models-value">
						{model.renderTime.toFixed(2)} ms
					</span>
				</li>
			))}
		</ul>
	);
}
