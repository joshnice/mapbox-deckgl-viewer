import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@joshnice/map-deck-viewer": fileURLToPath(
				new URL("../map-deck-viewer/index.ts", import.meta.url),
			),
		},
		dedupe: ["react", "react-dom"],
	},
	plugins: [
		react(),
		checker({
			typescript: true,
		}),
	],
});
