// mini-vdom.ts — a teaching toy, not React.
export type VNode = { tag: string; props: Record<string, string>; children: VChild[] };
export type VChild = VNode | string;

export function h(tag: string, props: Record<string, string> | null, ...children: VChild[]): VNode {
  return { tag, props: props ?? {}, children };
}

function create(v: VChild): Node {
  if (typeof v === "string") return document.createTextNode(v);
  const el = document.createElement(v.tag);
  for (const [k, val] of Object.entries(v.props)) el.setAttribute(k, val);
  for (const c of v.children) el.appendChild(create(c));
  return el;
}

function changed(a: VChild, b: VChild): boolean {
  if (typeof a === "string" || typeof b === "string") return a !== b;   // text vs text or text vs element
  return a.tag !== b.tag;
}

function patchProps(el: Element, oldP: Record<string, string>, newP: Record<string, string>): void {
  for (const k of Object.keys(oldP)) if (!(k in newP)) el.removeAttribute(k);
  for (const [k, v] of Object.entries(newP)) if (oldP[k] !== v) el.setAttribute(k, v);
}

function patchNode(parent: Node, dom: Node, oldV: VChild, newV: VChild): void {
  if (changed(oldV, newV)) { parent.replaceChild(create(newV), dom); return; }
  if (typeof oldV === "string" || typeof newV === "string") return;      // equal text
  patchProps(dom as Element, oldV.props, newV.props);
  patchChildren(dom, oldV.children, newV.children);
}

function patchChildren(dom: Node, oldC: VChild[], newC: VChild[]): void {
  const common = Math.min(oldC.length, newC.length);
  for (let i = 0; i < common; i++) patchNode(dom, dom.childNodes[i], oldC[i], newC[i]);  // by POSITION
  for (let i = common; i < newC.length; i++) dom.appendChild(create(newC[i]));
  for (let i = oldC.length - 1; i >= common; i--) dom.removeChild(dom.childNodes[i]);
}

export function mount(container: Element, tree: VNode): { update(next: VNode): void } {
  container.replaceChildren(create(tree));
  let prev = tree;
  return {
    update(next) { patchNode(container, container.firstChild!, prev, next); prev = next; },
  };
}
