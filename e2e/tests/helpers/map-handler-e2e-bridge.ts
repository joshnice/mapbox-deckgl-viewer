import { expect, type Page } from "@playwright/test";

const MAP_HANDLER_TEST_FN_ID = "mapdeckglb";

type RenderedMapFeature = {
	properties?: {
		layerId?: string;
	};
	layer?: {
		metadata?: {
			modelName?: string;
		};
	};
};

type MapHandlerE2eApi = {
	getAllMapFeatures: () => RenderedMapFeature[];
};

export async function getAllMapFeatures(page: Page): Promise<RenderedMapFeature[]> {
	return page.evaluate((mapHandlerTestFnId) => {
		const windowWithTestApi = window as unknown as Record<
			string,
			MapHandlerE2eApi | undefined
		>;
		const mapHandlerE2e = windowWithTestApi[mapHandlerTestFnId];
		return mapHandlerE2e?.getAllMapFeatures() ?? [];
	}, MAP_HANDLER_TEST_FN_ID);
}

export async function getModelFeatureCount(page: Page, modelName: string): Promise<number> {
	const features = await getAllMapFeatures(page);
	return features.filter((feature) => {
		return (
			typeof feature.properties?.layerId === "string" &&
			feature.layer?.metadata?.modelName === modelName
		);
	}).length;
}

export async function expectModelToBeRendered(
	page: Page,
	modelName: string,
): Promise<void> {
	await expect
		.poll(async () => {
			return getModelFeatureCount(page, modelName);
		})
		.toBeGreaterThan(0);
}

export async function expectModelFeatureCount(
	page: Page,
	modelName: string,
	expectedCount: number,
): Promise<void> {
	await expect
		.poll(async () => {
			return getModelFeatureCount(page, modelName);
		})
		.toBe(expectedCount);
}
