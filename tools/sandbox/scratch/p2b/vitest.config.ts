import { defineConfig } from 'vitest/config';
export default defineConfig({ esbuild: { jsx: 'automatic' }, test: { environment: 'jsdom', include: ['scratch/p2b/**/*.test.tsx'], globals: true, testTimeout: 20000, setupFiles: [] } });
