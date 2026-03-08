import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./results.css";
import { IconActionButton } from "./icon-action-button";
import { TestResult } from "../../types/test-result";

interface ResultsProps {
	disabled: boolean;
	isOpen: boolean;
	onToggle: () => void;
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
}: ResultsProps) {
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
						<span className="results__count">{results.length}</span>
					</div>
					{results.length === 0 && (
						<p className="results__state">No test results yet.</p>
					)}
					{results.length > 0 && (
						<div className="results__list">
							{[...results].reverse().map((res, index) => (
								<article className="results__item" key={res.id}>
									<div className="results__item-head">
										<p className="results__run">Run #{results.length - index}</p>
										<p className="results__time">
											{formatTimestamp(res.time.toISOString())}
										</p>
									</div>
									<p className="results__fps">
										<span className="results__label">Average FPS</span>
										<span className="results__value">{res.result.toFixed(2)}</span>
									</p>
								</article>
							))}
						</div>
					)}
				</section>
			)}
		</div>
	);
}
