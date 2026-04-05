import { expect, type Page } from "@playwright/test";

export async function runAllModelsFpsTest(page: Page): Promise<void> {
	const testingButton = page.getByRole("button", { name: "Open testing" });
	await expect(testingButton).toBeEnabled();
	await testingButton.click();

	const testingPanel = page.getByLabel("Testing panel");
	await expect(testingPanel).toBeVisible();

	await testingPanel.getByRole("radio", { name: "All Models FPS" }).check();

	const startButton = testingPanel.getByRole("button", { name: "Start Testing" });
	await startButton.click();

	await expect(testingPanel.getByRole("button", { name: "Testing..." })).toBeVisible();
	await expect(startButton).toBeVisible({ timeout: 40_000 });
}

export async function openLatestAllModelsResultDetails(
	page: Page,
): Promise<void> {
	const resultsButton = page.getByRole("button", { name: "Open results" });
	await expect(resultsButton).toBeEnabled();
	await resultsButton.click();

	const resultsPanel = page.getByLabel("Results panel");
	await expect(resultsPanel).toBeVisible();

	const latestAllModelsResult = resultsPanel
		.locator(".results__item")
		.filter({ hasText: "All Models FPS" })
		.first();
	await expect(latestAllModelsResult).toBeVisible();
	await expect(latestAllModelsResult.getByText("Average FPS")).toBeVisible();

	await latestAllModelsResult
		.getByRole("button", { name: /View details for run #/ })
		.click();
	await expect(
		page.getByRole("dialog", { name: /Run #\d+ All Models FPS/ }),
	).toBeVisible();
}

export async function expectModelAmountInAllModelsDetails(
	page: Page,
	modelName: string,
	amount: number,
): Promise<void> {
	const detailsItem = page.locator(".results__models-item", {
		has: page.locator(".results__models-name", { hasText: modelName }),
		hasText: String(amount),
	});
	await expect(detailsItem).toBeVisible();
}
