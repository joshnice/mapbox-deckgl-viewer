import type { Model } from "@joshnice/map-deck-viewer/src/types/model-type";
import "./settings.css";
import { ModelsAmountComponent } from "./settings-model-amount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

interface SettingsComponentProps {
	models: Model[];
	disabled: boolean;
	isOpen: boolean;
	onToggle: () => void;
	onModelAmountChanged: (modelAmount: Pick<Model, "id" | "amount">) => void;
}

export function SettingsComponent({
	models,
	disabled,
	isOpen,
	onToggle,
	onModelAmountChanged,
}: SettingsComponentProps) {
	return (
		<div className="settings">
			<button
				className="settings__button"
				type="button"
				aria-label="Open settings"
				aria-expanded={isOpen}
				disabled={disabled}
				onClick={onToggle}
			>
				<FontAwesomeIcon className="settings__icon" icon={faGear} />
			</button>
			{isOpen && !disabled && (
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
