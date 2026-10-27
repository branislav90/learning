import { z } from 'zod'; // any runtime validator works; zod is one common choice

const PrefsV1 = z.object({ v: z.literal(1), compact: z.boolean() });
const PrefsV2 = z.object({
  v: z.literal(2),
  density: z.enum(['comfortable', 'compact']),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
});
export type Prefs = z.infer<typeof PrefsV2>;

const DEFAULTS: Prefs = { v: 2, density: 'comfortable', theme: 'system' };
const KEY = 'ui.prefs';

function migrate(raw: unknown): Prefs {
  const v1 = PrefsV1.safeParse(raw);
  if (v1.success) {
    return { v: 2, density: v1.data.compact ? 'compact' : 'comfortable', theme: 'system' };
  }
  const v2 = PrefsV2.safeParse(raw);
  if (v2.success) return v2.data;
  return DEFAULTS; // unknown, corrupt, or from the future: never crash
}

export function loadPrefs(): Prefs {
  try {
    const text = window.localStorage.getItem(KEY);
    if (text === null) return DEFAULTS;
    return migrate(JSON.parse(text));
  } catch {
    // storage blocked (privacy mode), quota, or invalid JSON
    return DEFAULTS;
  }
}

export function savePrefs(p: Prefs): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore: preferences are best-effort */
  }
}
