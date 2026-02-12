import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@features": `${srcPath}/features`,
      "@shared": `${srcPath}/shared`,
      "@layouts": `${srcPath}/layouts`,
      "@config": `${srcPath}/config`,
      "@routes": `${srcPath}/routes`,
      "@contexts": `${srcPath}/contexts`,
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/__tests__/",
        "**/*.config.js",
        "**/main.jsx",
      ],
    },
  },
});
