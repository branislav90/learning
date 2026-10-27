// src/form/validation/rules.ts
export type Rule = (value: string) => string | undefined;

export const required =
  (message: string): Rule =>
  (v) => (v.trim() === "" ? message : undefined);

export const maxLength =
  (n: number, message: string): Rule =>
  (v) => (v.trim().length > n ? message : undefined);

export const matches =
  (re: RegExp, message: string): Rule =>
  (v) => (re.test(v.trim()) ? undefined : message);

/** First failing rule wins, so users see one actionable message at a time. */
export function firstError(value: string, ...rules: Rule[]): string | undefined {
  for (const rule of rules) {
    const message = rule(value);
    if (message !== undefined) return message;
  }
  return undefined;
}

// Pragmatic email check: not RFC-complete on purpose; the server/mailer is the authority.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidIban(input: string): boolean {
  const iban = input.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return false;
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    // A=10 ... Z=35; digits unchanged. Process digit-by-digit to avoid BigInt.
    const digits = ch >= "A" && ch <= "Z" ? String(ch.charCodeAt(0) - 55) : ch;
    for (const d of digits) remainder = (remainder * 10 + Number(d)) % 97;
  }
  return remainder === 1;
}
