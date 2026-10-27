async function chunked(items) {
  for (const item of items) {
    heavy(item);
    await Promise.resolve();
  }
}
