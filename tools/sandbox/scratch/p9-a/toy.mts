type VNode = string | { tag: string; props?: Record<string, string>; on?: Record<string, () => void>; children?: VNode[] };

class HydrationMismatch extends Error {}

function hydrate(vnode: VNode, parent: Node, cursorRef: { node: Node | null }): void {
  const cur = cursorRef.node;

  if (typeof vnode === "string") {
    if (!cur || cur.nodeType !== Node.TEXT_NODE) throw new HydrationMismatch("expected text");
    if (cur.textContent !== vnode) throw new HydrationMismatch(`text "${cur.textContent}" != "${vnode}"`);
    cursorRef.node = cur.nextSibling;                     // claim and advance
    return;
  }

  if (!cur || cur.nodeType !== Node.ELEMENT_NODE ||
      (cur as Element).tagName.toLowerCase() !== vnode.tag) {
    throw new HydrationMismatch(`expected <${vnode.tag}>`);
  }
  const el = cur as Element;
  for (const [name, handler] of Object.entries(vnode.on ?? {})) {
    el.addEventListener(name, handler);                   // "attach": claim == wire handlers
  }
  // Dev-only: report attribute differences, but do NOT patch (mirrors React's stance)
  for (const [k, v] of Object.entries(vnode.props ?? {})) {
    if (el.getAttribute(k) !== v) console.warn(`attr mismatch ${k}: "${el.getAttribute(k)}" vs "${v}"`);
  }
  const inner = { node: el.firstChild as Node | null };
  for (const child of vnode.children ?? []) hydrate(child, el, inner);
  if (inner.node) throw new HydrationMismatch("extra server nodes inside <" + vnode.tag + ">");
  cursorRef.node = el.nextSibling;                        // done with this element
}

function hydrateRootToy(container: Element, root: VNode): "hydrated" | "client-rendered" {
  try {
    hydrate(root, container, { node: container.firstChild });
    return "hydrated";
  } catch (e) {
    if (e instanceof HydrationMismatch) {
      console.error("recoverable:", e.message);           // → onRecoverableError
      container.replaceChildren(/* build from scratch */);
      return "client-rendered";                           // blast radius = the whole root here
    }
    throw e;
  }
}

import {JSDOM} from "jsdom";
const dom=new JSDOM("<body></body>");(globalThis as any).Node=dom.window.Node;
const run=(html:string,v:VNode)=>{const c=dom.window.document.createElement("div");c.innerHTML=html;return hydrateRootToy(c,v)};
console.log(run("<div><p>Hi</p></div>",{tag:"div",children:[{tag:"p",children:["Hi"]},{tag:"span",children:["!"]}]}));
console.log(run("<div><p>Hi</p><span>!</span></div>",{tag:"div",children:[{tag:"p",children:["Hi"]}]}));
console.log(run("<ul><li>A</li><li>B</li></ul>",{tag:"ul",children:[{tag:"li",children:["A"]},{tag:"li",children:["B"]},{tag:"li",children:["C"]}]}));
console.log(run("<div><p>Hi</p></div>",{tag:"div",children:[{tag:"p",children:["Hi"]}]}));
