async function chunked(items) {
  let t = performance.now();
  for (const item of items) {
    heavy(item);
    if (performance.now() - t > 8) { await new Promise(r => setTimeout(r)); t = performance.now(); }
  }
}
