import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests",
	use: {
		baseURL: "http://127.0.0.1:5173",
		headless: true,
	},
	webServer: {
		command: "npm run dev -w @joshnice/webdeckglb-site",
		url: "http://127.0.0.1:5173",
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
});
