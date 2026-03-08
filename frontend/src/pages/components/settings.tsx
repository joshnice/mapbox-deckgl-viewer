import type { Model } from "@joshnice/map-deck-viewer/src/types/model-type";
import { useState } from "react";
import settingsCog from "../../assets/settings-cog.svg";
import "./settings.css";
import { ModelsAmountComponent } from "./settings-model-amount";

interface SettingsComponentProps {
	models: Model[];
	onModelAmountChanged: (modelAmount: Pick<Model, "id" | "amount">) => void;
}

export function SettingsComponent({
	models,
	onModelAmountChanged,
}: SettingsComponentProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="settings">
			<button
				className="settings__button"
				type="button"
				aria-label="Open settings"
				aria-expanded={isOpen}
				disabled={models?.length === 0}
				onClick={() => setIsOpen((open) => !open)}
			>
				<img className="settings__icon" src={settingsCog} alt="" />
			</button>
			{isOpen && (
				<section className="settings__panel" aria-label="Settings panel">
					<h3 className="settings__title">Settings</h3>
					<ModelsAmountComponent
						models={models}
						onModelAmountChanged={onModelAmountChanged}
					/>
				</section>
			)}
		</div>
	);
}
