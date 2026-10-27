import { defineConfig } from "vitest/config";
export default defineConfig({
  test: { environment: "jsdom", globals: false, setupFiles: ["./setup.ts"], include: ["**/*.test.{ts,tsx}"] },
  esbuild: { jsx: "automatic" },
});
