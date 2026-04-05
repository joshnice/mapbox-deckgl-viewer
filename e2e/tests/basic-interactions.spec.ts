import { expect, test } from "./playwright-test.js";
import { expectModelFeatureCount } from "./helpers/map-handler-e2e-bridge.js";
import {
	addModelAssetToMap,
	addModelAssetsToMap,
} from "./helpers/model-upload.js";
import {
	expectModelToBeListedInSettings,
	openSettings,
	setModelAmount,
} from "./helpers/model-settings.js";

const MODEL_NAME = "car.glb";
const TWO_MODELS = ["car.glb", "duck.glb"];
const THREE_MODELS = ["car.glb", "duck.glb", "quad.glb"];

test("Adds model to the map", async ({ page }) => {
	await addModelAssetToMap(page, MODEL_NAME);

	await openSettings(page);
	await expectModelToBeListedInSettings(page, MODEL_NAME);
});

test("Adds model and changes amount to 100", async ({ page }) => {
	await addModelAssetToMap(page, MODEL_NAME);

	await openSettings(page);
	await setModelAmount(page, MODEL_NAME, 100);

	await expectModelFeatureCount(page, MODEL_NAME, 100);
});

test("Adds 2 models to the map", async ({ page }) => {
	await addModelAssetsToMap(page, TWO_MODELS);

	await openSettings(page);
	for (const modelName of TWO_MODELS) {
		await expectModelToBeListedInSettings(page, modelName);
	}
});

test("Adds 3 models to the map", async ({ page }) => {
	await addModelAssetsToMap(page, THREE_MODELS);

	await openSettings(page);
	for (const modelName of THREE_MODELS) {
		await expectModelToBeListedInSettings(page, modelName);
	}
});

test("Adds 3 models and changes amount for each", async ({ page }) => {
	const targetModelAmounts: Record<string, number> = {
		"car.glb": 2,
		"duck.glb": 4,
		"quad.glb": 6,
	};

	await addModelAssetsToMap(page, THREE_MODELS);

	await openSettings(page);
	for (const [modelName, amount] of Object.entries(targetModelAmounts)) {
		await setModelAmount(page, modelName, amount);
	}

	for (const [modelName, amount] of Object.entries(targetModelAmounts)) {
		await expectModelFeatureCount(page, modelName, amount);
	}
});
