import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({ resolve: { alias: { "server-only": path.resolve(__dirname, "../so/node_modules/server-only/empty.js") } }, test: { include: ["*.test.ts"] } });
