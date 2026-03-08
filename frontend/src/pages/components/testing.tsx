import { faFlask } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { TestingMode } from "../../types/test-result-type";
import "./testing.css";
import { IconActionButton } from "./icon-action-button";
import type { TestOptions } from "../../types/test-options-type";
import { NumberInputComponent } from "./number-input";

interface TestingProps {
	disabled: boolean;
	isOpen: boolean;
	isTesting: boolean;
	onStartTesting: (options: TestOptions) => void;
	onToggle: () => void;
}

const TEST_MODE_OPTIONS: Array<{ label: string; value: TestingMode }> = [
	{ label: "All Models FPS", value: "all-models-fps" },
	{ label: "Single Model FPS", value: "single-model-fps" },
	{ label: "Render Time", value: "render-time" },
];
const MIN_SINGLE_MODEL_AMOUNT = 1;

export function TestingComponent({
	disabled,
	isOpen,
	isTesting,
	onStartTesting,
	onToggle,
}: TestingProps) {
	const [selectedMode, setSelectedMode] =
		useState<TestingMode>("all-models-fps");
	const [singleModelAmount, setSingleModelAmount] = useState(1000);

	const handleStartTestingClicked = () => {
		onStartTesting({ type: selectedMode, amount: singleModelAmount });
	};

	return (
		<div className="testing">
			<IconActionButton
				ariaLabel="Open testing"
				className="testing__button"
				disabled={disabled}
				isExpanded={isOpen}
				onClick={onToggle}
			>
				<FontAwesomeIcon className="testing__icon" icon={faFlask} />
			</IconActionButton>
			{isOpen && !disabled && (
				<section className="testing__panel" aria-label="Testing panel">
					<h3 className="testing__title">Testing</h3>
					<fieldset className="testing__modes">
						<legend className="testing__modes-title">Type</legend>
						<div className="testing__modes-list">
							{TEST_MODE_OPTIONS.map((option) => (
								<label className="testing__mode" key={option.value}>
									<input
										checked={selectedMode === option.value}
										className="testing__mode-input"
										name="testing-mode"
										onChange={() => setSelectedMode(option.value)}
										type="radio"
										value={option.value}
									/>
									<span className="testing__mode-label">{option.label}</span>
								</label>
							))}
						</div>
					</fieldset>
					{selectedMode === "single-model-fps" && (
						<div className="testing__field">
							<label className="testing__field-label" htmlFor="single-model-amount">
								Model amount
							</label>
							<NumberInputComponent
								className="testing__field-input"
								disabled={isTesting}
								id="single-model-amount"
								min={MIN_SINGLE_MODEL_AMOUNT}
								onValueChange={setSingleModelAmount}
								step={1}
								value={singleModelAmount}
							/>
						</div>
					)}
					<button
						className="testing__start-button"
						disabled={isTesting}
						onClick={handleStartTestingClicked}
						type="button"
					>
						{isTesting ? "Testing..." : "Start Testing"}
					</button>
				</section>
			)}
		</div>
	);
}
