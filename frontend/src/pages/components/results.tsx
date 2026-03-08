import { faChartLine, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import "./results.css";
import { IconActionButton } from "./icon-action-button";
import type { TestResult } from "../../types/test-result-type";
import { DialogComponent } from "./dialog";
import {
	ResultAllModelsDetails,
	ResultAllModelsItem,
} from "./result-all-models";
import {
	ResultSingleModelDetails,
	ResultSingleModelItem,
} from "./result-single-model";
import {
	ResultRenderTimeDetails,
	ResultRenderTimeItem,
} from "./result-render-time";

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

function getTestTypeLabel(result: TestResult) {
	if (result.type === "all-models-fps") {
		return "All Models FPS";
	}
	if (result.type === "single-model-fps") {
		return "Single Model FPS";
	}
	return "Render Time";
}

function renderResultItem(
	result: TestResult,
	runNumber: number,
	timestamp: string,
	onOpenDetails: () => void,
) {
	if (result.type === "all-models-fps") {
		return (
			<ResultAllModelsItem
				onOpenDetails={onOpenDetails}
				result={result}
				runNumber={runNumber}
				timestamp={timestamp}
			/>
		);
	}

	if (result.type === "single-model-fps") {
		return (
			<ResultSingleModelItem
				onOpenDetails={onOpenDetails}
				result={result}
				runNumber={runNumber}
				timestamp={timestamp}
			/>
		);
	}

	return (
		<ResultRenderTimeItem
			onOpenDetails={onOpenDetails}
			result={result}
			runNumber={runNumber}
			timestamp={timestamp}
		/>
	);
}

function renderResultDetails(result: TestResult) {
	if (result.type === "all-models-fps") {
		return <ResultAllModelsDetails result={result} />;
	}

	if (result.type === "single-model-fps") {
		return <ResultSingleModelDetails result={result} />;
	}

	return <ResultRenderTimeDetails result={result} />;
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
							{[...results].reverse().map((result, index) => {
								const runNumber = results.length - index;
								return (
									<div key={result.id}>
										{renderResultItem(
											result,
											runNumber,
											formatTimestamp(result.time.toISOString()),
											() => setSelectedResult(result),
										)}
									</div>
								);
							})}
						</div>
					)}
				</section>
			)}
			<DialogComponent
				isOpen={selectedResult != null}
				onClose={handleCloseDialog}
				title={
					selectedResultRun == null || selectedResult == null
						? "Run Details"
						: `Run #${selectedResultRun} ${getTestTypeLabel(selectedResult)}`
				}
			>
				{selectedResult != null && renderResultDetails(selectedResult)}
			</DialogComponent>
		</div>
	);
}
