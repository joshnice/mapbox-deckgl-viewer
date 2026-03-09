import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
	plugins: [react()],
	build: {
		emptyOutDir: false,
		lib: {
			entry: "index.ts",
			formats: ["es"],
			fileName: "index",
		},
		rollupOptions: {
			external: [
				"react",
				"react-dom",
				"mapbox-gl",
				"@turf/bbox",
				"@turf/bbox-polygon",
				"@turf/boolean-within",
				"@turf/helpers",
			],
		},
	},
});
