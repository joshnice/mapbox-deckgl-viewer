import { useEffect, useState } from "react";
import "./model-settings.css";
import { useTestingResultValue } from "../hooks/use-testing-result";
import { useRenderingTimeValue } from "../hooks/use-rendering-time";
import { useSubjectContext } from "../state/subject-context";
import { useModelStats as useModelStatsValue } from "../hooks/use-model-stat";
import { useTestingValue } from "../hooks/use-testing";

interface ModelSettingsProps {
	showStats: boolean;
	models: Record<string, File>;
	zoomLevel: number;
	showOptions: boolean;
	onAmountChange: (id: string, amount: number) => void;
	onTestingClicked: (singleModelTest: boolean, amount: number) => void;
	onChangeModelClick: () => void;
	onZoomLevelChange: (zoomLevel: number) => void;
}

export function ModelSettingsComponent({
	showStats,
	models,
	zoomLevel,
	showOptions,
	onAmountChange,
	onTestingClicked,
	onChangeModelClick,
	onZoomLevelChange,
}: ModelSettingsProps) {

	const { $testing } = useSubjectContext();

	const results = useTestingResultValue();
	const renderingTime = useRenderingTimeValue();
	const stats = useModelStatsValue();
	const testing = useTestingValue();

	const [singleModelTest, setSingleModelTest] = useState(false);
	const [singleModelTestAmount, setSingleModelTestAmount] = useState<number>(1);
	const [amount, setAmount] = useState<Record<string, number>>({});

	useEffect(() => {
		setAmount(createStartingAmount(models));
	}, [models]);


	const handleAmountChanged = (id: string, newAmount: number) => {
		const parsedAmount = Number.isNaN(newAmount) ? 0 : newAmount;
		setAmount({ ...amount, [id]: parsedAmount });
		onAmountChange(id, parsedAmount);
	};

	const handleTestingClicked = () => {
		$testing.next(true);
		onTestingClicked(singleModelTest, singleModelTestAmount);
	};

	const getPerformanceClassName = () => {
		if (results == null) {
			return "none";
		}

		if (results > 50) {
			return "good";
		}

		if (results > 30) {
			return "ok";
		}

		return "bad";
	};

	const getRenderingTimeClassName = () => {
		if (renderingTime == null) {
			return "none";
		}

		if (renderingTime < 0.5) {
			return "good";
		}

		if (renderingTime < 1) {
			return "ok";
		}

		return "bad";
	};

	return (
		<div className="model-settings">
			<h2>Model settings</h2>
			{showOptions && <div className="model-setting-items">
				{showStats && (
					<>
						<div className={`model-setting-item ${getRenderingTimeClassName()}`}>
							Rendering Time: <span>{renderingTime ? `${renderingTime.toFixed(2)} secs` : "No result"} </span>
						</div>
					</>
				)}
				<div className={`model-setting-item ${getPerformanceClassName()}`}>
					Performance: <span>{results ? `${results.toFixed(2)} fps` : "No result"}</span>
				</div>
				{Object.entries(models).map(([id, modelFile]) => (
					<div className="model-setting-item" key={id}>
						<span className="model-name">{modelFile.name}</span>
						<input
							className="amount-input"
							type="number"
							value={amount[id] ?? 0}
							onChange={({ target }) => handleAmountChanged(id, Number.parseInt(target.value))}
						/>
					</div>
				))}
				{showStats && (
					<div className="model-setting-item model-stats">
						{stats != null &&
							Object.entries(stats).map(([key, value]) => {
								return (
									<div key={key} className="model-stat">
										<div>{key}:</div> <div>{value}</div>
									</div>
								);
							})}
					</div>
				)}
				<div className="model-setting-item">
					Zoom level
					<input
						className="amount-input"
						type="number"
						value={zoomLevel}
						onChange={({ target }) => onZoomLevelChange(Number.parseInt(target.value))}
					/>
				</div>
				<div className="model-setting-item">
					Single Model
					<input type="checkbox" checked={singleModelTest} onChange={() => setSingleModelTest(!singleModelTest)} />
					<input
						disabled={testing || !singleModelTest}
						className="amount-input"
						type="number"
						value={singleModelTestAmount}
						onChange={({ target }) => setSingleModelTestAmount(Number.parseInt(target.value))}
					/>
				</div>
				<div className="model-setting-item testing-button">
					<button disabled={testing || singleModelTest && singleModelTestAmount === 0} onClick={handleTestingClicked}>
						Start Testing
					</button>
					<button disabled={testing ?? false} onClick={onChangeModelClick}>
						Change Model
					</button>
				</div>
			</div>}
		</div>
	);
}

function createStartingAmount(models: Record<string, File>) {
	const amount: Record<string, number> = {};
	Object.keys(models).forEach((model) => {
		amount[model] = 1;
	});
	return amount;
}
