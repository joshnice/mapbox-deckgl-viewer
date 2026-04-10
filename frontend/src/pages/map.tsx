import {
	MapHandlerComponent,
	type MapHandlerForwardRefProps,
	type GlbModel,
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

	const getModelName = (model: Model) => {
		if (model.type === "glb") {
			return model.file.name;
		}

		return (
			model.files.find((file) => file.name.toLowerCase() === "tileset.json")?.name ??
			model.files[0]?.name ??
			"3d-tiles-model"
		);
	};

	const handleModelsAdded = (modelFiles: FileList) => {
		const files = Array.from(modelFiles);
		const tilesetFile =
			files.find((file) => file.name.toLowerCase() === "tileset.json") ?? null;
		const glbFileCount = files.filter((file) =>
			file.name.toLowerCase().endsWith(".glb"),
		).length;
		const has3DTilesBundle = tilesetFile != null && glbFileCount > 0;

		if (has3DTilesBundle && tilesetFile) {
			const model = {
				id: crypto.randomUUID(),
				type: "3dtile" as const,
				files,
			};
			mapHandlerRef.current?.addModel(model);
			setModels((m) => [...m, model]);
			mapHandlerRef.current?.updateModelPositions();
			return;
		}

		for (const modelFile of files) {
			if (!modelFile.name.toLowerCase().endsWith(".glb")) {
				continue;
			}
			const model = {
				id: crypto.randomUUID(),
				type: "glb" as const,
				file: modelFile,
				amount: 1,
			};
			mapHandlerRef.current?.addModel(model);
			setModels((m) => [...m, model]);
		}
		mapHandlerRef.current?.updateModelPositions();
	};

	const handleModelAmountChanged = (
		modelAmount: Pick<GlbModel, "id" | "amount">,
	) => {
		setModels((currentModels) =>
			currentModels.map((model) =>
				model.id === modelAmount.id && model.type === "glb"
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
				name: getModelName(model),
				amount: model.type === "glb" ? model.amount : 1,
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
			const glbModels = models.filter(
				(model): model is GlbModel => model.type === "glb",
			);

			for (const model of glbModels) {
				await mapHandlerRef.current?.updateModelAmount({ ...model, amount: 0 });
			}

			let previouslyTestedModelId: string | null = null;
			const results: TestResultSingleModel["models"] = [];

			for (const model of glbModels) {
				if (previouslyTestedModelId) {
					const foundModel = glbModels.find(
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
						name: getModelName(model),
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

	const handleGetModelRenderTimes = async () => {
		return Promise.all(
			models.map(async (model) => {
				const renderTime =
					(await mapHandlerRef.current?.getModelRenderTime(model.id)) ?? null;

				return {
					id: model.id,
					name: getModelName(model),
					renderTime,
				};
			}),
		);
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
				onGetModelRenderTimes={handleGetModelRenderTimes}
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
