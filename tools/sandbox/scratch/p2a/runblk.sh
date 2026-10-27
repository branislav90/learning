#!/bin/bash
# usage: runblk.sh lesson-number
n=$1; D=blk$n; rm -rf $D; python3 extract.py ../../../../react-mastery/02-react-rendering-and-internals/$n-*.md $D >/dev/null
B=../../node_modules/.bin
for f in $D/*.ts; do
  if grep -q "from \"react\|from 'react\|document\.\|window\." $f; then continue; fi
  OUT=$(mktemp -d); $B/esbuild $f --format=esm --outfile=$OUT/x.mjs --log-level=error 2>/dev/null || { echo "## $f: esbuild fail"; continue; }
  echo "## $f"; ( cd $OUT && node x.mjs 2>&1 | head -${2:-25} )
done
