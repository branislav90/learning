import {defineConfig} from 'vitest/config';
export default defineConfig({test:{environment:'jsdom',include:['scratch/p0p1-d/*.test.tsx']},esbuild:{jsx:'automatic'}});
