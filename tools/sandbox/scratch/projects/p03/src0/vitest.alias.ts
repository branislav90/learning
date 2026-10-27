import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
const rr = (f: string) => fileURLToPath(new URL(`../node_modules/react-router/dist/development/${f}`, import.meta.url));
export default defineConfig({
  resolve: { alias: [{ find: /^react-router\/dom$/, replacement: rr('dom-export.mjs') }, { find: /^react-router$/, replacement: rr('index.mjs') }] },
  test: { environment: 'jsdom', globals: true, setupFiles: ['./setup.ts'], server: { deps: { inline: ['react-router'] } } },
});
