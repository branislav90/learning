// vite.config.ts (excerpt)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const buildId = process.env.GIT_SHA ?? "dev";

export default defineConfig({
  plugins: [react()],
  define: { __BUILD_ID__: JSON.stringify(buildId) },
  build: { sourcemap: "hidden" },   // emit maps, don't reference them from the bundle
});
