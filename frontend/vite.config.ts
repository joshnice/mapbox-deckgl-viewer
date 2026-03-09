import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		dedupe: ["react", "react-dom"],
	},
	plugins: [
		react(),
		checker({
			typescript: true,
		}),
	],
});
