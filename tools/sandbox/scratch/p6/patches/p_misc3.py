from patchlib import apply
apply('18',[
("  const t = Date.parse(`${raw}T00:00:00Z`);        // UTC midnight: no local timezone drift\n  return Number.isNaN(t) ? null : t;",
 "  const t = Date.parse(`${raw}T00:00:00Z`);        // UTC midnight: no local timezone drift\n  if (Number.isNaN(t)) return null;\n  return new Date(t).toISOString().slice(0, 10) === raw ? t : null;   // reject rolled-over dates like 2025-02-31"),
])
