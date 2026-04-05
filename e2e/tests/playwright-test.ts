import { test as base } from "@playwright/test";

export const test = base.extend({
	page: async ({ page }, use) => {
		await page.addInitScript(() => {
			(window as Window & { playwright?: boolean }).playwright = true;
		});
		await use(page);
	},
});

export { expect } from "@playwright/test";
