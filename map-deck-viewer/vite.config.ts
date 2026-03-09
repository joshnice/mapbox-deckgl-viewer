import { defineConfig } from "vite";
export default defineConfig({
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
				"react/jsx-runtime",
				"react/jsx-dev-runtime",
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
