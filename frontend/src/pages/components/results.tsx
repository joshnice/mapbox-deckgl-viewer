import {
	faChartLine,
	faCircleInfo,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import "./results.css";
import { IconActionButton } from "./icon-action-button";
import { TestResult } from "../../types/test-result";
import { DialogComponent } from "./dialog";

interface ResultsProps {
	disabled: boolean;
	isOpen: boolean;
	onToggle: () => void;
	onClearResults: () => void;
	results: TestResult[];
}

function formatTimestamp(isoDate: string) {
	return new Date(isoDate).toLocaleString([], {
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export function ResultsComponent({
	disabled,
	isOpen,
	results,
	onToggle,
	onClearResults,
}: ResultsProps) {
	const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

	const selectedResultRun = useMemo(() => {
		if (selectedResult == null) {
			return null;
		}
		const selectedIndex = results.findIndex(
			(result) => result.id === selectedResult.id,
		);
		if (selectedIndex === -1) {
			return null;
		}
		return selectedIndex + 1;
	}, [results, selectedResult]);

	const handleCloseDialog = () => {
		setSelectedResult(null);
	};

	const handleClearResults = () => {
		handleCloseDialog();
		onClearResults();
	};

	return (
		<div className="results">
			<IconActionButton
				ariaLabel="Open results"
				className="results__button"
				disabled={disabled}
				isExpanded={isOpen}
				onClick={onToggle}
			>
				<FontAwesomeIcon className="results__icon" icon={faChartLine} />
			</IconActionButton>
			{isOpen && !disabled && (
				<section className="results__panel" aria-label="Results panel">
					<div className="results__header">
						<h3 className="results__title">Results</h3>
						<div className="results__header-actions">
							<button
								aria-label="Clear results"
								className="results__clear-button"
								disabled={results.length === 0}
								onClick={handleClearResults}
								type="button"
							>
								<FontAwesomeIcon
									className="results__clear-icon"
									icon={faTrashCan}
								/>
							</button>
						</div>
					</div>
					{results.length === 0 && (
						<p className="results__state">No test results yet.</p>
					)}
					{results.length > 0 && (
						<div className="results__list">
							{[...results].reverse().map((res, index) => (
								<article className="results__item" key={res.id}>
									<div className="results__item-head">
										<div className="results__item-meta">
											<p className="results__run">
												Run #{results.length - index}
											</p>
											<p className="results__time">
												{formatTimestamp(res.time.toISOString())}
											</p>
										</div>
										<button
											aria-label={`View details for run #${results.length - index}`}
											className="results__info-button"
											onClick={() => setSelectedResult(res)}
											type="button"
										>
											<FontAwesomeIcon
												className="results__info-icon"
												icon={faCircleInfo}
											/>
										</button>
									</div>
									<p className="results__fps">
										<span className="results__label">Average FPS</span>
										<span className="results__value">
											{res.result.toFixed(2)}
										</span>
									</p>
								</article>
							))}
						</div>
					)}
				</section>
			)}
			<DialogComponent
				isOpen={selectedResult != null}
				onClose={handleCloseDialog}
				title={
					selectedResultRun == null
						? "Run Details"
						: `Run #${selectedResultRun} Model Configuration`
				}
			>
				{selectedResult != null && selectedResult.models.length > 0 && (
					<ul className="results__models-list">
						{selectedResult.models.map((model) => (
							<li
								className="results__models-item"
								key={`${selectedResult.id}-${model.id}`}
							>
								<span className="results__models-name">{model.name}</span>
								<span className="results__models-amount">{model.amount}</span>
							</li>
						))}
					</ul>
				)}
				{selectedResult != null && selectedResult.models.length === 0 && (
					<p className="results__models-empty">
						No models were active for this run.
					</p>
				)}
			</DialogComponent>
		</div>
	);
}
