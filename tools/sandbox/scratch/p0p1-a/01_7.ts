new PerformanceObserver((l) => {
  l.getEntries().filter((e) => e.duration > 100).forEach((e) => console.warn(e));
}).observe({ type: "longtask", buffered: true });
