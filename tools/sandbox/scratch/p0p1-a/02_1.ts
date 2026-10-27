// Run in DevTools console after load, to learn what the page waited for.
const [nav] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
console.table({
  responseEnd: nav.responseEnd,
  domInteractive: nav.domInteractive,                 // parsing done
  domContentLoadedEventStart: nav.domContentLoadedEventStart,
  loadEventStart: nav.loadEventStart,
});
for (const p of performance.getEntriesByType("paint")) {
  console.log(p.name, Math.round(p.startTime), "ms"); // first-paint, first-contentful-paint
}
const css = performance.getEntriesByType("resource").filter(r => r.name.endsWith(".css"));
console.table(css.map(r => ({ url: r.name, start: Math.round(r.startTime), end: Math.round(r.responseEnd) })));
