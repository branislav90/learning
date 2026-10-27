#!/bin/sh
cd /Users/todorbra/Projects/ReactLearning/tools/sandbox/scratch/p3/l13-18 && ../../../node_modules/.bin/vitest run --config vitest.config.mjs "$@" 2>&1 | grep -v "^$\|^stdout\|^ *$"
