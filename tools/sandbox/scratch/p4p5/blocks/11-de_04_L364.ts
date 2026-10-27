// vite.config.ts (sketch; verify option names for your Vite version)
import { defineConfig } from "vite";
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: mode === "demo"
      ? { "@/infrastructure/gateway": "/src/infrastructure/gateway.memory.ts" }
      : {},
  },
}));
export {};
