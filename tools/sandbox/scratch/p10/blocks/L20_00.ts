import { z } from 'zod';

const V1 = z.object({ v: z.literal(1), compact: z.boolean() });
const V2 = z.object({
  v: z.literal(2),
  density: z.enum(['comfortable', 'compact']),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
});
type Prefs = z.infer<typeof V2>;
const DEFAULTS: Prefs = { v: 2, density: 'comfortable', theme: 'system' };

function load(text: string | null): Prefs {
  try {
    if (text === null) return DEFAULTS;
    const raw: unknown = JSON.parse(text);
    const a = V1.safeParse(raw);
    if (a.success) return { v: 2, density: a.data.compact ? 'compact' : 'comfortable', theme: 'system' };
    const b = V2.safeParse(raw);
    return b.success ? b.data : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}
