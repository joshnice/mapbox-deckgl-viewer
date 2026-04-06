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

export async function runSingleModelFpsTest(
	page: Page,
	amount: number,
): Promise<void> {
	const testingButton = page.getByRole("button", { name: "Open testing" });
	await expect(testingButton).toBeEnabled();
	await testingButton.click();

	const testingPanel = page.getByLabel("Testing panel");
	await expect(testingPanel).toBeVisible();

	await testingPanel.getByRole("radio", { name: "Single Model FPS" }).check();

	const amountInput = testingPanel.locator("#single-model-amount");
	await amountInput.fill(String(amount));
	await expect(amountInput).toHaveValue(String(amount));

	const startButton = testingPanel.getByRole("button", { name: "Start Testing" });
	await startButton.click();

	const resultsButton = page.getByRole("button", { name: "Open results" });
	await expect(resultsButton).toBeEnabled();
	await resultsButton.click();

	const resultsPanel = page.getByLabel("Results panel");
	await expect(resultsPanel).toBeVisible();
	await expect(
		resultsPanel
			.locator(".results__item")
			.filter({ hasText: "Single Model FPS" })
			.first(),
	).toBeVisible({ timeout: 40_000 });

	await resultsButton.click();
	await expect(resultsPanel).toHaveCount(0);
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

export async function openLatestSingleModelResultDetails(
	page: Page,
): Promise<void> {
	const resultsButton = page.getByRole("button", { name: "Open results" });
	await expect(resultsButton).toBeEnabled();
	await resultsButton.click();

	const resultsPanel = page.getByLabel("Results panel");
	await expect(resultsPanel).toBeVisible();

	const latestSingleModelResult = resultsPanel
		.locator(".results__item")
		.filter({ hasText: "Single Model FPS" })
		.first();
	await expect(latestSingleModelResult).toBeVisible();
	await expect(latestSingleModelResult.getByText("Average FPS")).toBeVisible();

	await latestSingleModelResult
		.getByRole("button", { name: /View details for run #/ })
		.click();
	await expect(
		page.getByRole("dialog", { name: /Run #\d+ Single Model FPS/ }),
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

export async function expectInputAmountInSingleModelDetails(
	page: Page,
	amount: number,
): Promise<void> {
	await expect(
		page.getByText("Input amount:").locator(".."),
	).toContainText(String(amount));
}

export async function expectSingleModelFpsInDetails(
	page: Page,
	modelName: string,
): Promise<void> {
	const detailsItem = page.locator(".results__models-item", {
		has: page.locator(".results__models-name", { hasText: modelName }),
	});
	await expect(detailsItem).toBeVisible();
	await expect(detailsItem).toContainText("FPS");
}
