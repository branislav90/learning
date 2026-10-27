import { n as e, r as t, t as n } from "./tabs-piCEOAfu.js";
import { Children as r, cloneElement as i, isValidElement as a } from "react";
import { jsx as o } from "react/jsx-runtime";
// src/core/slot.tsx
function s({ children: e, ref: n, ...o }) {
	let s = r.only(e);
	if (!a(s)) return null;
	let l = s.props;
	return i(s, {
		...c(o, l),
		ref: t(n, l.ref)
	});
}
function c(t, n) {
	let r = {
		...t,
		...n
	};
	for (let i of Object.keys(t)) /^on[A-Z]/.test(i) && typeof t[i] == "function" && typeof n[i] == "function" && (r[i] = e(n[i], t[i]));
	return (t.className || n.className) && (r.className = [t.className, n.className].filter(Boolean).join(" ")), (t.style || n.style) && (r.style = {
		...t.style,
		...n.style
	}), r;
}
// src/components/button/button.tsx
function l({ variant: e = "solid", size: t = "md", loading: n, asChild: r, disabled: i, className: a, children: c, onClick: l, ...u }) {
	let d = r ? s : "button", f = i || n;
	return /* @__PURE__ */ o(d, {
		...u,
		className: ["acme-button", a].filter(Boolean).join(" "),
		"data-variant": e,
		"data-size": t,
		"data-loading": n || void 0,
		disabled: r ? void 0 : i,
		"aria-disabled": f || void 0,
		"aria-busy": n || void 0,
		onClick: (e) => f ? e.preventDefault() : l?.(e),
		children: c
	});
}
export { l as Button, n as Tabs };
