import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { TestResultAllModels } from "../../types/test-result-type";

interface ResultAllModelsItemProps {
	result: TestResultAllModels;
	runNumber: number;
	timestamp: string;
	onOpenDetails: () => void;
}

export function ResultAllModelsItem({
	result,
	runNumber,
	timestamp,
	onOpenDetails,
}: ResultAllModelsItemProps) {
	return (
		<article className="results__item">
			<div className="results__item-head">
				<div className="results__item-meta">
					<div className="results__run-row">
						<p className="results__run">Run #{runNumber}</p>
						<span className="results__type">All Models FPS</span>
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
				<span className="results__value">{result.result.toFixed(2)}</span>
			</p>
		</article>
	);
}

interface ResultAllModelsDetailsProps {
	result: TestResultAllModels;
}

export function ResultAllModelsDetails({
	result,
}: ResultAllModelsDetailsProps) {
	if (result.models.length === 0) {
		return (
			<p className="results__models-empty">
				No models were active for this run.
			</p>
		);
	}

	return (
		<ul className="results__models-list">
			{result.models.map((model) => (
				<li className="results__models-item" key={`${result.id}-${model.id}`}>
					<span className="results__models-name">{model.name}</span>
					<span className="results__models-amount">{model.amount}</span>
				</li>
			))}
		</ul>
	);
}
