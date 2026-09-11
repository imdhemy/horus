import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: /^jsnes$/,
        replacement: fileURLToPath(new URL("../src/index.js", import.meta.url)),
      },
    ],
  },
  optimizeDeps: {
    exclude: ["jsnes"],
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      // Watch the core jsnes source for changes
      ignored: ["!**/node_modules/jsnes/**"],
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.js"],
  },
});
