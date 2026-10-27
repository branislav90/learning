import { defineConfig } from 'vitest/config';
export default defineConfig({ root: process.cwd(), test: { environment: 'jsdom', include: ['*.test.jsx'], globals: true }, esbuild:{jsx:'automatic'} });
