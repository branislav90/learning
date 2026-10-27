import { createContext as e, use as t, useCallback as n, useId as r, useMemo as i, useRef as a, useState as o } from "react";
import { jsx as s } from "react/jsx-runtime";
// src/core/compose.ts
function c(e, t) {
	return (n) => {
		e?.(n), n.defaultPrevented || t?.(n);
	};
}
function l(...e) {
	return (t) => {
		let n = [];
		for (let r of e) if (typeof r == "function") {
			let e = r(t);
			typeof e == "function" ? n.push(e) : n.push(() => r(null));
		} else r && (r.current = t, n.push(() => {
			r.current = null;
		}));
		return () => n.forEach((e) => e());
	};
}
// src/core/context.ts
function u(n, r) {
	let i = e(null);
	i.displayName = n;
	function a() {
		let e = t(i);
		if (e === null) throw Error(`<${n}> must be used within <${r}>`);
		return e;
	}
	return [i, a];
}
// src/hooks/useControllableState.ts
function d({ value: e, defaultValue: t, onChange: r }) {
	let [i, s] = o(t), c = e !== void 0, l = c ? e : i;
	a(c);
	let u = a(r);
	return u.current = r, [l, n((e) => {
		let t = typeof e == "function" ? e(l) : e;
		c || s(t), Object.is(t, l) || u.current?.(t);
	}, [c, l])];
}
// src/primitives/tabs/tabs.tsx
var [f, p] = u("Tabs", "Tabs.Root");
function m({ value: e, defaultValue: t = "", onValueChange: n, orientation: a = "horizontal", ...o }) {
	let c = r(), [l, u] = d({
		value: e,
		defaultValue: t,
		onChange: n
	}), p = i(() => ({
		baseId: c,
		value: l,
		setValue: u,
		orientation: a
	}), [
		c,
		l,
		u,
		a
	]);
	return /* @__PURE__ */ s(f, {
		value: p,
		children: /* @__PURE__ */ s("div", {
			...o,
			"data-orientation": a
		})
	});
}
function h(e) {
	let { orientation: t } = p();
	return /* @__PURE__ */ s("div", {
		role: "tablist",
		"aria-orientation": t,
		...e
	});
}
function g({ value: e, disabled: t, onKeyDown: n, onClick: r, ...i }) {
	let a = p(), o = a.value === e, l = (e) => {
		let t = a.orientation === "horizontal", n = {
			[t ? "ArrowRight" : "ArrowDown"]: 1,
			[t ? "ArrowLeft" : "ArrowUp"]: -1
		}[e.key], r = e.currentTarget.closest("[role=\"tablist\"]"), i = Array.from(r.querySelectorAll("[role=\"tab\"]:not([disabled])")), o = i.indexOf(e.currentTarget), s;
		n ? s = i[(o + n + i.length) % i.length] : e.key === "Home" ? s = i[0] : e.key === "End" && (s = i.at(-1)), s && (e.preventDefault(), s.focus(), s.click());
	};
	return /* @__PURE__ */ s("button", {
		...i,
		type: "button",
		role: "tab",
		id: `${a.baseId}-tab-${e}`,
		"aria-selected": o,
		"aria-controls": `${a.baseId}-panel-${e}`,
		tabIndex: o ? 0 : -1,
		"data-state": o ? "active" : "inactive",
		disabled: t,
		onClick: c(r, () => a.setValue(e)),
		onKeyDown: c(n, l)
	});
}
function _({ value: e, forceMount: t, ...n }) {
	let r = p(), i = r.value === e;
	return !i && !t ? null : /* @__PURE__ */ s("div", {
		...n,
		role: "tabpanel",
		id: `${r.baseId}-panel-${e}`,
		"aria-labelledby": `${r.baseId}-tab-${e}`,
		hidden: !i,
		tabIndex: 0
	});
}
var v = {
	Root: m,
	List: h,
	Trigger: g,
	Panel: _
};
export { c as n, l as r, v as t };
