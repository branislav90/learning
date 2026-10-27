const obs = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn(`Long task: ${entry.duration.toFixed(0)}ms`, entry);
  }
});
obs.observe({ type: "longtask", buffered: true });
