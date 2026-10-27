import { defineConfig } from "vitest/config";
export default defineConfig({ test: { environment: "jsdom", setupFiles: ["./setup.ts"], include: ["*.test.tsx"], testTimeout: 4000 }, esbuild: { jsx: "automatic" } });
