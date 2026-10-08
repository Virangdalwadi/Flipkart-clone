import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [tailwindcss(), visualizer({ open: true })],
  server: {
    proxy: {
      "/api": "http://localhost:3044",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./test/setup.js",
    globals: true,
  },
});
