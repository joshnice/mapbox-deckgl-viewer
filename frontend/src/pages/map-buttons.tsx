import type { Model } from "@joshnice/map-deck-viewer/src/types/model-type";
import { useEffect, useState } from "react";
import { SettingsComponent } from "./components/settings";
import { TestingComponent } from "./components/testing";
import "./map-buttons.css";

interface MapButtonsProps {
	models: Model[];
	onModelAmountChanged: (modelAmount: Pick<Model, "id" | "amount">) => void;
}

type OpenMenu = "settings" | "testing" | null;

export function MapButtonsComponent({
	models,
	onModelAmountChanged,
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
			<TestingComponent
				disabled={disabled}
				isOpen={openMenu === "testing"}
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
