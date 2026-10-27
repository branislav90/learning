export function batchedMeasureThenWrite<T extends HTMLElement>(
  els: T[],
  read: (el: T) => number,
  write: (el: T, value: number) => void,
): void {
  const values = els.map(read);            // phase 1: reads only
  els.forEach((el, i) => write(el, values[i])); // phase 2: writes only
}
