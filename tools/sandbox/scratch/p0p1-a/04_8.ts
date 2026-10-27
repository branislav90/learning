// Diagnostic only; don't ship as a fix.
export function watchForeignMutations(root: HTMLElement): () => void {
  const mo = new MutationObserver((records) => {
    for (const r of records) {
      for (const n of r.addedNodes) {
        if (n instanceof HTMLElement && n.tagName === "FONT") {
          console.warn("Translator-like wrapper inserted into React root", n);
        }
      }
    }
  });
  mo.observe(root, { childList: true, subtree: true });
  return () => mo.disconnect();
}
