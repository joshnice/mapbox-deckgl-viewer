import { test } from "./playwright-test.js";
import { expectModelFeatureCount } from "./helpers/map-handler-e2e-bridge.js";
import { openSettings, setModelAmount } from "./helpers/model-settings.js";
import {
	addModelAssetToMap,
	addModelAssetsToMap,
} from "./helpers/model-upload.js";
import {
	expectModelAmountInAllModelsDetails,
	openLatestAllModelsResultDetails,
	runAllModelsFpsTest,
} from "./helpers/testing-results.js";

const CAR_MODEL = "car.glb";
const DUCK_MODEL = "duck.glb";

test("All Models FPS with one model", async ({ page }) => {
	await addModelAssetToMap(page, CAR_MODEL);

	await runAllModelsFpsTest(page);
	await openLatestAllModelsResultDetails(page);

	await expectModelAmountInAllModelsDetails(page, CAR_MODEL, 1);
});

test("All Models FPS with two different models", async ({ page }) => {
	await addModelAssetsToMap(page, [CAR_MODEL, DUCK_MODEL]);

	await runAllModelsFpsTest(page);
	await openLatestAllModelsResultDetails(page);

	await expectModelAmountInAllModelsDetails(page, CAR_MODEL, 1);
	await expectModelAmountInAllModelsDetails(page, DUCK_MODEL, 1);
});

test("All Models FPS with custom amounts for two models", async ({ page }) => {
	await addModelAssetsToMap(page, [CAR_MODEL, DUCK_MODEL]);

	await openSettings(page);
	await setModelAmount(page, CAR_MODEL, 5);
	await setModelAmount(page, DUCK_MODEL, 10);

	await expectModelFeatureCount(page, CAR_MODEL, 5);
	await expectModelFeatureCount(page, DUCK_MODEL, 10);

	await runAllModelsFpsTest(page);
	await openLatestAllModelsResultDetails(page);

	await expectModelAmountInAllModelsDetails(page, CAR_MODEL, 5);
	await expectModelAmountInAllModelsDetails(page, DUCK_MODEL, 10);
});
