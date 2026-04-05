import { expect, test } from "./playwright-test.js";
import { dropAssetOnMap } from "./helpers/model-upload.js";

const INVALID_MODEL_ASSET_NAME = "tree.jpg";

test("Rejects non-glb files dropped onto the map", async ({ page }) => {
	await dropAssetOnMap(page, INVALID_MODEL_ASSET_NAME, "image/jpeg");

	await expect(
		page.getByText("Drag and drop model files onto the map"),
	).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Open settings" }),
	).toBeDisabled();
});
