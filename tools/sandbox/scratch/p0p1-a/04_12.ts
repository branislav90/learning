/** Only call with markup you authored or sanitized on a trusted pipeline. Never with user input. */
export function safeSetHtml(el: HTMLElement, trusted: string): void {
  el.innerHTML = trusted;
}

export function setTextWithLinks(el: HTMLElement, text: string): void {
  const frag = document.createDocumentFragment();
  const re = /https?:\/\/[^\s<]+/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    const start = m.index ?? 0;
    if (start > last) frag.append(text.slice(last, start));   // plain text → Text node
    const a = document.createElement("a");
    a.href = m[0];                                           // validated by http(s) pattern
    a.textContent = m[0];
    a.rel = "noopener noreferrer";
    frag.append(a);
    last = start + m[0].length;
  }
  if (last < text.length) frag.append(text.slice(last));
  el.replaceChildren(frag);
}
