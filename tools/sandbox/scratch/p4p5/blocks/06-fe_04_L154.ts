// vite.config.ts (fragment) — Vite does not read tsconfig paths by default
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
export {};
