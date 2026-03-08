import type { Model } from "@joshnice/map-deck-viewer/src/types/model-type";
import "./settings-model-amount.css";

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
						<input
							className="model-amount__input"
							type="number"
							min={1}
							step={1}
							value={model.amount}
							onChange={(event) => {
								const rawValue = Number(event.target.value);
								const nextAmount = Number.isFinite(rawValue)
									? Math.max(1, Math.floor(rawValue))
									: 1;
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
