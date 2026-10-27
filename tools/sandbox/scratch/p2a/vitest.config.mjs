import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'jsdom', include: ['*.test.jsx'], globals: true }, esbuild:{jsx:'automatic'} });
