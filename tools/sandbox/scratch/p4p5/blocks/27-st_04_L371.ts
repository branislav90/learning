// Dev-only helper: count stylesheet rules and measure style recalculation proxy
export function logStyleStats(label: string) {
  let rules = 0;
  for (const sheet of Array.from(document.styleSheets)) {
    try { rules += sheet.cssRules.length; } catch { /* cross-origin sheet: skip */ }
  }
  console.log(label, { sheets: document.styleSheets.length, rules });
}
// Call before/after a suspicious interaction. A growing rule count under repeated interaction signals
// unbounded dynamic classes (§3.4).
export {};
