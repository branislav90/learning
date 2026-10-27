import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost/" });
for (const k of ["window","document","navigator","HTMLElement","Node","Element","MouseEvent","KeyboardEvent","Event","HTMLInputElement","getComputedStyle","DocumentFragment","MutationObserver","SVGElement","HTMLIFrameElement","Text","FocusEvent","InputEvent","PointerEvent"]) {
  try { Object.defineProperty(globalThis, k, { value: (dom.window as any)[k], configurable: true, writable: true }); } catch {}
}
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
