from patchlib import apply
apply('04',[("  if (Number.isNaN(t)) throw new ParseError(p, 'valid ISO 8601 instant', v);\n  return t;","  if (Number.isNaN(t)) throw new ParseError(p, 'valid ISO 8601 instant', v);   // NaN catches malformed input; V8 rolls an impossible day such as 02-31 over instead of returning NaN\n  return t;")])
