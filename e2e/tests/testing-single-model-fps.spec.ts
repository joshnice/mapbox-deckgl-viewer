import { expect, test } from "./playwright-test.js";
import { addModelAssetToMap, addModelAssetsToMap } from "./helpers/model-upload.js";
import {
	expectInputAmountInSingleModelDetails,
	expectSingleModelFpsInDetails,
	openLatestSingleModelResultDetails,
	runSingleModelFpsTest,
} from "./helpers/testing-results.js";

const CAR_MODEL = "car.glb";
const DUCK_MODEL = "duck.glb";

test("Single Model FPS with one model and amount 1", async ({ page }) => {
	await addModelAssetToMap(page, CAR_MODEL);

	await runSingleModelFpsTest(page, 1);
	await openLatestSingleModelResultDetails(page);

	await expectInputAmountInSingleModelDetails(page, 1);
	await expectSingleModelFpsInDetails(page, CAR_MODEL);
	await expect(page.locator(".results__models-item")).toHaveCount(1);
});

test("Single Model FPS with two models and amount 3", async ({ page }) => {
	await addModelAssetsToMap(page, [CAR_MODEL, DUCK_MODEL]);

	await runSingleModelFpsTest(page, 3);
	await openLatestSingleModelResultDetails(page);

	await expectInputAmountInSingleModelDetails(page, 3);
	await expectSingleModelFpsInDetails(page, CAR_MODEL);
	await expectSingleModelFpsInDetails(page, DUCK_MODEL);
	await expect(page.locator(".results__models-item")).toHaveCount(2);
});

test("Single Model FPS cannot be started when no models are added", async ({ page }) => {
	await page.goto("/");

	const testingButton = page.getByRole("button", { name: "Open testing" });
	const resultsButton = page.getByRole("button", { name: "Open results" });

	await expect(testingButton).toBeDisabled();
	await expect(resultsButton).toBeDisabled();
	await expect(page.getByLabel("Testing panel")).toHaveCount(0);
	await expect(page.getByLabel("Results panel")).toHaveCount(0);
});
