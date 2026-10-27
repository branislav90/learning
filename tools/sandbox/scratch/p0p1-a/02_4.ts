export function countRenderableElements(root: Element): number {
  let count = 0;
  const walk = (el: Element) => {
    const display = getComputedStyle(el).display;
    if (display === "none") return;           // skip whole subtree
    if (display !== "contents") count++;      // contents: no box of its own
    for (const child of el.children) walk(child);
  };
  for (const child of root.children) walk(child);
  return count;
}
