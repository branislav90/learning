import { createContext, useContext, useMemo, type ReactNode } from 'react';

type Rules = Record<string, { percent: number; allow?: string[] }>;
const FlagCtx = createContext<{ rules: Rules; userId: string } | null>(null);

export function FlagProvider({ rules, userId, children }: { rules: Rules; userId: string; children: ReactNode }) {
  const value = useMemo(() => ({ rules, userId }), [rules, userId]);   // evaluated once per provider value
  return <FlagCtx value={value}>{children}</FlagCtx>;                  // ⚠ React 19 syntax; use <FlagCtx.Provider> on 18
}

export function useFlag(key: string): boolean {
  const ctx = useContext(FlagCtx);
  if (!ctx) throw new Error('useFlag must be used within <FlagProvider>');
  const rule = ctx.rules[key];
  return rule ? isEnabled(rule, ctx.userId, key) : false;   // unknown flag => off (safe default)
}
