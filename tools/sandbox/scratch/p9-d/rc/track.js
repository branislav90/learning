export const counts = {};
export function track(name) { counts[name] = (counts[name] || 0) + 1; }
export function reset() { for (const k of Object.keys(counts)) delete counts[k]; }
