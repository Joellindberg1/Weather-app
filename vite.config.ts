import { defineConfig } from "vite";

export default defineConfig({
	server: {
		proxy: {
			"/smhi": {
				target: "https://opendata-download-metfcst.smhi.se",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/smhi/, ""),
			},
		},
		cors: true, // Tillåt CORS-lösningar för utvecklingsservern
	},
});
