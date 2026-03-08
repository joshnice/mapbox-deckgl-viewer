import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { TestResultSingleModel } from "../../types/test-result-type";

interface ResultSingleModelItemProps {
	result: TestResultSingleModel;
	runNumber: number;
	timestamp: string;
	onOpenDetails: () => void;
}

export function ResultSingleModelItem({
	result,
	runNumber,
	timestamp,
	onOpenDetails,
}: ResultSingleModelItemProps) {
	const averageFps =
		result.models.length === 0
			? 0
			: result.models.reduce((total, model) => total + model.fps, 0) /
				result.models.length;

	return (
		<article className="results__item">
			<div className="results__item-head">
				<div className="results__item-meta">
					<div className="results__run-row">
						<p className="results__run">Run #{runNumber}</p>
						<span className="results__type">Single Model FPS</span>
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
				<span className="results__label">Average FPS</span>
				<span className="results__value">{averageFps.toFixed(2)}</span>
			</p>
		</article>
	);
}

interface ResultSingleModelDetailsProps {
	result: TestResultSingleModel;
}

export function ResultSingleModelDetails({
	result,
}: ResultSingleModelDetailsProps) {
	return (
		<>
			<p className="results__models-summary">
				Input amount: <strong>{result.amount}</strong>
			</p>
			<ul className="results__models-list">
				{result.models.map((model) => (
					<li className="results__models-item" key={`${result.id}-${model.id}`}>
						<span className="results__models-name">{model.name}</span>
						<span className="results__models-value">
							{model.fps.toFixed(2)} FPS
						</span>
					</li>
				))}
			</ul>
		</>
	);
}
