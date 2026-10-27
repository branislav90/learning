#!/bin/zsh
d=/Users/todorbra/Projects/ReactLearning/tools/sandbox/scratch/projects/p$1/src0
cat > $d/tsconfig.json <<'J'
{"compilerOptions":{"target":"ES2022","lib":["ES2023","DOM","DOM.Iterable"],"module":"ESNext","moduleResolution":"bundler","jsx":"react-jsx","strict":true,"noUncheckedIndexedAccess":true,"esModuleInterop":true,"skipLibCheck":true,"noEmit":true,"types":["node","vitest/globals"]},"include":["src","*.ts","*.tsx"]}
J
cat > $d/vitest.config.ts <<'J'
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'jsdom', globals: true, setupFiles: ['./setup.ts'] } });
J
echo 'import "@testing-library/jest-dom/vitest";' > $d/setup.ts
