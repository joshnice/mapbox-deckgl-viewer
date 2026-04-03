import {
	MapHandlerComponent,
	type MapHandlerForwardRefProps,
	type Model,
} from "@joshnice/map-deck-viewer";
import { useRef, useState } from "react";
import { ModelDropZoneComponent } from "./components/model-dropzone";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map.css";
import { MapButtonsComponent } from "./map-buttons";
import { GithubLogo } from "./components/github-logo";
import { PerformanceStatsComponent } from "./components/performance-stats";
import type {
	TestResult,
	TestResultSingleModel,
} from "../types/test-result-type";
import type { TestOptions } from "../types/test-options-type";

const MAPBOX_ACCESS_TOKEN =
	"pk.eyJ1Ijoiam9zaG5pY2U5OCIsImEiOiJjanlrMnYwd2IwOWMwM29vcnQ2aWIwamw2In0.RRsdQF3s2hQ6qK-7BH5cKg";

export function MapComponent() {
	const mapHandlerRef = useRef<MapHandlerForwardRefProps | null>(null);
	const [models, setModels] = useState<Model[]>([]);
	const [testingResults, setTestingResults] = useState<TestResult[]>([]);
	const [testingInProgress, setTestingInProgress] = useState(false);

	const handleModelsAdded = (modelFiles: FileList) => {
		for (const modelFile of modelFiles) {
			const model = {
				id: crypto.randomUUID(),
				file: modelFile,
				amount: 1,
			};
			mapHandlerRef.current?.addModel(model);
			setModels((m) => [...m, model]);
		}
		mapHandlerRef.current?.updateModelPositions();
	};

	const handleModelAmountChanged = (
		modelAmount: Pick<Model, "id" | "amount">,
	) => {
		setModels((currentModels) =>
			currentModels.map((model) =>
				model.id === modelAmount.id
					? {
							...model,
							amount: modelAmount.amount,
						}
					: model,
			),
		);
		mapHandlerRef.current?.updateModelAmount(modelAmount);
	};

	const handleStartTesting = async (testOptions: TestOptions) => {
		if (testingInProgress) {
			return;
		}

		if (testOptions.type === "all-models-fps") {
			const modelsSnapshot = models.map((model) => ({
				id: model.id,
				name: model.file.name,
				amount: model.amount,
			}));

			setTestingInProgress(true);
			try {
				const result = await mapHandlerRef.current?.startTesting();
				if (result == null) {
					return;
				}
				setTestingResults((res) => [
					...res,
					{
						id: crypto.randomUUID(),
						type: "all-models-fps",
						time: new Date(),
						result,
						models: modelsSnapshot,
					},
				]);
			} finally {
				setTestingInProgress(false);
			}
		}

		if (testOptions.type === "single-model-fps") {
			for (const model of models) {
				await mapHandlerRef.current?.updateModelAmount({ ...model, amount: 0 });
			}

			let previouslyTestedModelId: string | null = null;
			const results: TestResultSingleModel["models"] = [];

			for (const model of models) {
				if (previouslyTestedModelId) {
					const foundModel = models.find(
						(m) => m.id === previouslyTestedModelId,
					);
					if (foundModel) {
						await mapHandlerRef.current?.updateModelAmount({
							...foundModel,
							amount: 0,
						});
					}
				}
				await mapHandlerRef.current?.updateModelAmount({
					...model,
					amount: testOptions.amount,
				});
				const result = await mapHandlerRef.current?.startTesting();
				if (result) {
					results.push({
						id: model.id,
						name: model.file.name,
						fps: result,
					});
				}
				previouslyTestedModelId = model.id;
			}

			setTestingResults((res) => [
				...res,
				{
					id: crypto.randomUUID(),
					type: "single-model-fps",
					amount: testOptions.amount,
					time: new Date(),
					models: results,
				},
			]);
		}
	};

	const handleClearTestingResults = () => {
		setTestingResults([]);
	};

	return (
		<ModelDropZoneComponent
			hasModels={models.length > 0}
			handleModelFileDropped={handleModelsAdded}
		>
			<PerformanceStatsComponent />

			<MapButtonsComponent
				testingResults={testingResults}
				models={models}
				testingInProgress={testingInProgress}
				onModelAmountChanged={handleModelAmountChanged}
				onStartTesting={handleStartTesting}
				onClearResults={handleClearTestingResults}
			/>

			<GithubLogo />

			<MapHandlerComponent
				mapboxAccessKey={MAPBOX_ACCESS_TOKEN}
				ref={mapHandlerRef}
			/>
		</ModelDropZoneComponent>
	);
}
