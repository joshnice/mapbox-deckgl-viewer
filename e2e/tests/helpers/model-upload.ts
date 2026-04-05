import { expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expectModelToBeRendered } from "./map-handler-e2e-bridge.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function dropAssetOnMap(
	page: Page,
	assetName: string,
	contentType: string,
): Promise<void> {
	await page.goto("/");
	await expect(
		page.getByText("Drag and drop model files onto the map"),
	).toBeVisible();

	const modelPath = path.resolve(__dirname, `../../assets/${assetName}`);
	const modelBuffer = await readFile(modelPath);
	const bufferArray = [...modelBuffer];

	const dataTransfer = await page.evaluateHandle(
		({ bytes, name, mimeType }) => {
			const dt = new DataTransfer();
			const file = new File([new Uint8Array(bytes)], name, {
				type: mimeType,
			});
			dt.items.add(file);
			return dt;
		},
		{ bytes: bufferArray, name: assetName, mimeType: contentType },
	);

	const dropzone = page.locator(".map-container");
	await dropzone.dispatchEvent("dragenter", { dataTransfer });
	await dropzone.dispatchEvent("dragover", { dataTransfer });
	await dropzone.dispatchEvent("drop", { dataTransfer });
}

export async function addModelAssetToMap(
	page: Page,
	modelName: string,
): Promise<void> {
	await dropAssetOnMap(page, modelName, "model/gltf-binary");

	await expect(
		page.getByText("Drag and drop model files onto the map"),
	).toHaveCount(0);
	await expectModelToBeRendered(page, modelName);
}
