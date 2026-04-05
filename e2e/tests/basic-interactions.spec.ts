import { expect, test } from "./playwright-test.js";
import {
	expectModelFeatureCount,
} from "./helpers/map-handler-e2e-bridge.js";
import { addModelAssetToMap } from "./helpers/model-upload.js";

const MODEL_NAME = "car.glb";

test("Adds model to the map", async ({ page }) => {
	await addModelAssetToMap(page, MODEL_NAME);

	const settingsButton = page.getByRole("button", { name: "Open settings" });
	await expect(settingsButton).toBeEnabled();
	await settingsButton.click();
	await expect(page.getByText(MODEL_NAME)).toBeVisible();
});

test("Adds model and changes amount to 100", async ({ page }) => {
	await addModelAssetToMap(page, MODEL_NAME);

	const settingsButton = page.getByRole("button", { name: "Open settings" });
	await expect(settingsButton).toBeEnabled();
	await settingsButton.click();

	const modelAmountItem = page.locator(".model-amount__item", {
		hasText: MODEL_NAME,
	});
	const amountInput = modelAmountItem.locator('input[type="number"]');
	await expect(amountInput).toHaveValue("1");
	await amountInput.fill("100");
	await expect(amountInput).toHaveValue("100");

	await expectModelFeatureCount(page, MODEL_NAME, 100);
});
