import { expect, test } from "./playwright-test.js";
import { expectModelFeatureCount } from "./helpers/map-handler-e2e-bridge.js";
import {
	addModelAssetToMap,
	addModelAssetsToMap,
	openMapPage,
} from "./helpers/model-upload.js";
import {
	expectModelToBeListedInSettings,
	openSettings,
	setModelAmount,
} from "./helpers/model-settings.js";

const MODEL_NAME = "car.glb";
const TWO_MODELS = ["car.glb", "duck.glb"];
const THREE_MODELS = ["car.glb", "duck.glb", "quad.glb"];
const REPO_URL_PATTERN =
	/^https:\/\/github\.com\/joshnice\/mapbox-deckgl-viewer\/?$/;

test("GitHub repo button opens the repository", async ({ page }) => {
	await openMapPage(page);

	const githubButton = page.getByRole("button", { name: "Open GitHub Repo" });
	await expect(githubButton).toBeVisible();

	const [popup] = await Promise.all([
		page.waitForEvent("popup"),
		githubButton.click(),
	]);

	await popup.waitForLoadState("domcontentloaded");
	await expect(popup).toHaveURL(REPO_URL_PATTERN);
});

test("Top-right action buttons are disabled until a model is added", async ({
	page,
}) => {
	await page.goto("/");

	const resultsButton = page.getByRole("button", { name: "Open results" });
	const testingButton = page.getByRole("button", { name: "Open testing" });
	const renderTimesButton = page.getByRole("button", {
		name: "Open model render times",
	});
	const settingsButton = page.getByRole("button", { name: "Open settings" });

	await expect(resultsButton).toBeDisabled();
	await expect(testingButton).toBeDisabled();
	await expect(renderTimesButton).toBeDisabled();
	await expect(settingsButton).toBeDisabled();

	await addModelAssetToMap(page, MODEL_NAME);

	await expect(resultsButton).toBeEnabled();
	await expect(testingButton).toBeEnabled();
	await expect(renderTimesButton).toBeEnabled();
	await expect(settingsButton).toBeEnabled();
});

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
