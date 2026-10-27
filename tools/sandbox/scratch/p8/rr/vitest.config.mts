import { defineConfig } from "vitest/config";
export default defineConfig({ test: { server: { deps: { inline: [/react-router/] } }, environment: "jsdom", setupFiles: ["/Users/todorbra/Projects/ReactLearning/tools/sandbox/scratch/p8/rr/setup.ts"] }, esbuild: { jsx: "automatic" } });
