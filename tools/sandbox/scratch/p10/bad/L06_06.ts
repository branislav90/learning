// SSR: if you must inline JSON in a script tag, escape characters that can break out of the script context
export function serializeForScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/ /g, "\\u2028")
    .replace(/ /g, "\\u2029");
}
// Prefer: <script type="application/json" id="__data" nonce="…">…escaped json…</script>, parsed with JSON.parse (not executed as JS)
