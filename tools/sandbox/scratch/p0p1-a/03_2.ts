function resizeBad(items: HTMLElement[], container: HTMLElement): void {
  for (const el of items) {
    el.style.width = `${container.offsetWidth / 2}px`; // read after previous write
  }
}

function resizeGood(items: HTMLElement[], container: HTMLElement): void {
  const w = container.offsetWidth / 2;               // all reads first
  for (const el of items) el.style.width = `${w}px`; // then all writes
}
