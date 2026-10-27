// parse.ts — tiny combinators (illustrative; a schema library does this for you)
export class ParseError extends Error {
  constructor(public readonly path: string, public readonly expected: string, public readonly received: unknown) {
    super(`${path}: expected ${expected}, got ${describeValue(received)}`);
    this.name = 'ParseError';
  }
}

function describeValue(v: unknown): string {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  return typeof v;
}

export type Parser<T> = (input: unknown, path: string) => T;

export const str: Parser<string> = (v, p) => {
  if (typeof v !== 'string') throw new ParseError(p, 'string', v);
  return v;
};

export const idString: Parser<string> = (v, p) => {
  if (typeof v === 'string' && v !== '') return v;
  if (typeof v === 'number' && Number.isSafeInteger(v)) return String(v);   // accept numeric ids, normalize to string
  throw new ParseError(p, 'id (string or safe integer)', v);
};

export const nullableStr: Parser<string | undefined> = (v, p) => {
  if (v === null || v === undefined) return undefined;
  return str(v, p);
};

export const minorUnits: Parser<number> = (v, p) => {
  const n = typeof v === 'string' && /^-?\d+$/.test(v) ? Number(v) : v;
  if (typeof n !== 'number' || !Number.isSafeInteger(n)) throw new ParseError(p, 'integer minor units', v);
  return n;
};

export const isoInstant: Parser<number> = (v, p) => {
  if (typeof v !== 'string' || !/(Z|[+-]\d{2}:\d{2})$/.test(v)) throw new ParseError(p, 'ISO 8601 instant with offset', v);
  const t = Date.parse(v);
  if (Number.isNaN(t)) throw new ParseError(p, 'valid ISO 8601 instant', v);
  return t;                                   // epoch milliseconds
};

export function object(input: unknown, path: string): Record<string, unknown> {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) throw new ParseError(path, 'object', input);
  return input as Record<string, unknown>;    // narrowing cast is local and justified: we just checked
}

export function array<T>(item: Parser<T>): Parser<T[]> {
  return (v, p) => {
    if (!Array.isArray(v)) throw new ParseError(p, 'array', v);
    return v.map((x, i) => item(x, `${p}[${i}]`));
  };
}
export {};
