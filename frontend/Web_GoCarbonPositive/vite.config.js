import { defineConfig } from "vite";
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
});
