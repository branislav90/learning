// src/app/data/serialize.ts
const ESCAPES: Record<string, string> = {
  '<': '\\u003c',
  '>': '\\u003e',
  '&': '\\u0026',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
};

export function serializeForScript(value: unknown): string {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (c) => ESCAPES[c]!);
}

export function dataScript(key: string, value: unknown, nonce?: string): string {
  const n = nonce ? ` nonce="${nonce}"` : '';
  return `<script${n}>(self.__DATA__=self.__DATA__||[]).push([${serializeForScript(key)},${serializeForScript(value)}])</script>`;
}
