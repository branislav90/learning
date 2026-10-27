import { useInsertionEffect } from "react";

const injected = new Set<string>();

export function useStyleRule(id: string, css: string): void {
  useInsertionEffect(() => {
    if (injected.has(id)) return;
    injected.add(id);
    const style = document.createElement("style");
    style.dataset.rule = id;
    style.textContent = css;
    document.head.appendChild(style);
  });
}
