import { expect, test } from "./playwright-test.js";

test("Loads the webpage and shows the drop model prompt", async ({ page }) => {
	await page.goto("/");
	await expect(page).toHaveTitle(/Mapdeckglb/);
	await expect(
		page.getByText("Drag and drop model files onto the map"),
	).toBeVisible();
	await expect(page.getByText("Supports glb model format")).toBeVisible();
});
