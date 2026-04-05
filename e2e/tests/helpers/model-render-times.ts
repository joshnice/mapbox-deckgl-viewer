import { expect, type Page } from "@playwright/test";

function getRenderTimesPanel(page: Page) {
	return page.getByLabel("Model render times panel");
}

function escapeRegex(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function openModelRenderTimes(page: Page): Promise<void> {
	const button = page.getByRole("button", { name: "Open model render times" });
	await expect(button).toBeEnabled();
	await button.click();
	await expect(getRenderTimesPanel(page)).toBeVisible();
}

export async function expectModelRenderTimeToBePresent(
	page: Page,
	modelName: string,
): Promise<void> {
	const panel = getRenderTimesPanel(page);
	const modelRow = panel.getByRole("row", {
		name: new RegExp(`^${escapeRegex(modelName)}\\s+\\d+\\.\\d{2} ms$`),
	});
	await expect(modelRow).toBeVisible();
}
