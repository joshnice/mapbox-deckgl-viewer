import type { Model } from "@joshnice/map-deck-viewer/src/types/model-type";
import { useEffect, useState } from "react";
import { ResultsComponent } from "./components/results";
import { SettingsComponent } from "./components/settings";
import type { TestResult } from "../types/test-result-type";
import { TestingComponent } from "./components/testing";
import "./map-buttons.css";
import type { TestOptions } from "../types/test-options-type";

interface MapButtonsProps {
	testingResults: TestResult[];
	models: Model[];
	testingInProgress: boolean;
	onModelAmountChanged: (modelAmount: Pick<Model, "id" | "amount">) => void;
	onStartTesting: (options: TestOptions) => void;
	onClearResults: () => void;
}

type OpenMenu = "results" | "settings" | "testing" | null;

export function MapButtonsComponent({
	testingResults,
	testingInProgress,
	models,
	onModelAmountChanged,
	onStartTesting,
	onClearResults,
}: MapButtonsProps) {
	const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
	const disabled = models.length === 0;

	useEffect(() => {
		if (disabled) {
			setOpenMenu(null);
		}
	}, [disabled]);

	return (
		<div className="map-buttons">
			<ResultsComponent
				disabled={disabled}
				isOpen={openMenu === "results"}
				onToggle={() =>
					setOpenMenu((menu) => (menu === "results" ? null : "results"))
				}
				results={testingResults}
				onClearResults={onClearResults}
			/>
			<TestingComponent
				disabled={disabled}
				isOpen={openMenu === "testing"}
				isTesting={testingInProgress}
				onStartTesting={onStartTesting}
				onToggle={() =>
					setOpenMenu((menu) => (menu === "testing" ? null : "testing"))
				}
			/>

			<SettingsComponent
				models={models}
				disabled={disabled}
				isOpen={openMenu === "settings"}
				onToggle={() =>
					setOpenMenu((menu) => (menu === "settings" ? null : "settings"))
				}
				onModelAmountChanged={onModelAmountChanged}
			/>
		</div>
	);
}
