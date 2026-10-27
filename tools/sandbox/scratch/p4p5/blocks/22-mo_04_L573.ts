import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Defensive: if any linked package accidentally resolves its own react copy, force the app's.
    dedupe: ["react", "react-dom"],
  },
});
export {};
