import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === 'analyze' && visualizer({ filename: 'dist/stats.html', gzipSize: true })],
  build: { sourcemap: true },
  test: { environment: 'jsdom', globals: true },
}));
