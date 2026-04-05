import { expect, type Locator, type Page } from "@playwright/test";

function getModelAmountItem(page: Page, modelName: string): Locator {
	return page.locator(".model-amount__item", {
		hasText: modelName,
	});
}

export async function openSettings(page: Page): Promise<void> {
	const settingsButton = page.getByRole("button", { name: "Open settings" });
	await expect(settingsButton).toBeEnabled();
	await settingsButton.click();
}

export async function expectModelToBeListedInSettings(
	page: Page,
	modelName: string,
): Promise<void> {
	await expect(getModelAmountItem(page, modelName)).toBeVisible();
}

export async function setModelAmount(
	page: Page,
	modelName: string,
	amount: number,
): Promise<void> {
	const modelAmountItem = getModelAmountItem(page, modelName);
	const amountInput = modelAmountItem.locator('input[type="number"]');
	await amountInput.fill(String(amount));
	await expect(amountInput).toHaveValue(String(amount));
}
