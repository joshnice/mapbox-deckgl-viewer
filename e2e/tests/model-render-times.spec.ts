import { test } from "./playwright-test.js";
import { addModelAssetToMap, addModelAssetsToMap } from "./helpers/model-upload.js";
import {
	expectModelRenderTimeToBePresent,
	openModelRenderTimes,
} from "./helpers/model-render-times.js";

const CAR_MODEL = "car.glb";
const TWO_MODELS = ["car.glb", "duck.glb"];

test("Shows render time for one model", async ({ page }) => {
	await addModelAssetToMap(page, CAR_MODEL);

	await openModelRenderTimes(page);
	await expectModelRenderTimeToBePresent(page, CAR_MODEL);
});

test("Shows render times for two models", async ({ page }) => {
	await addModelAssetsToMap(page, TWO_MODELS);

	await openModelRenderTimes(page);
	for (const modelName of TWO_MODELS) {
		await expectModelRenderTimeToBePresent(page, modelName);
	}
});
