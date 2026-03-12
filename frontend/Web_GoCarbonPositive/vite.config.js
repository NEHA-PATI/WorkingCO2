import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { createRequire } from "node:module";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));
const require = createRequire(import.meta.url);
const processBrowserPath = require.resolve("process/browser");
const bufferPath = require.resolve("buffer/");

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: [
      { find: "@features", replacement: `${srcPath}/features` },
      { find: "@shared", replacement: `${srcPath}/shared` },
      { find: "@layouts", replacement: `${srcPath}/layouts` },
      { find: "@config", replacement: `${srcPath}/config` },
      { find: "@routes", replacement: `${srcPath}/routes` },
      { find: "@contexts", replacement: `${srcPath}/contexts` },
      { find: /^process\/$/, replacement: processBrowserPath },
      { find: /^process$/, replacement: processBrowserPath },
      { find: /^buffer\/$/, replacement: bufferPath },
      { find: /^buffer$/, replacement: bufferPath },
    ],
  },
  optimizeDeps: {
    include: ["buffer", "process"],
  },
});
