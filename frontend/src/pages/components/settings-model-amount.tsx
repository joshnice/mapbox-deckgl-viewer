import type { Model } from "@joshnice/map-deck-viewer/src/types/model-type";
import "./settings-model-amount.css";
import { NumberInputComponent } from "./number-input";

interface ModelAmountProps {
	models: Model[];
	onModelAmountChanged: (modelAmount: Pick<Model, "id" | "amount">) => void;
}

export function ModelsAmountComponent({
	models,
	onModelAmountChanged,
}: ModelAmountProps) {
	const orderedModels = [...models].reverse();

	return (
		<section className="model-amount" aria-label="Model amounts">
			<h4 className="model-amount__title">Model amounts</h4>
			<ul className="model-amount__list">
				{orderedModels.map((model) => (
					<li className="model-amount__item" key={model.id}>
						<span className="model-amount__name">{model.file.name}</span>
						<NumberInputComponent
							className="model-amount__input"
							min={1}
							step={1}
							value={model.amount}
							onValueChange={(nextAmount) => {
								onModelAmountChanged({
									id: model.id,
									amount: nextAmount,
								});
							}}
						/>
					</li>
				))}
			</ul>
		</section>
	);
}
