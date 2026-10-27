import { isValidElement } from "react";

const el = <button className="primary" disabled>Save</button>;

console.log(isValidElement(el));          // true
console.log(el.type);                      // "button"
console.log(el.key);                       // null
console.log(el.props);                     // { className: "primary", disabled: true, children: "Save" }

// DOM node, from the live document after React rendered it:
const node = document.querySelector("button.primary")!;
console.log(node instanceof HTMLButtonElement);   // true
console.log(node.disabled, node.className);        // true "primary"
export {};
