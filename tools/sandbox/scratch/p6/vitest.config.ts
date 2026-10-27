import { defineConfig } from 'vitest/config';
import path from 'path';
export default defineConfig({ esbuild:{jsx:'automatic'}, resolve:{alias:{'react-error-boundary':path.resolve(__dirname,'reb/package/dist/react-error-boundary.js')}}, test: { environment: 'jsdom', include: ['**/*.test.{ts,tsx}'], globals: true, root: '.' } });
