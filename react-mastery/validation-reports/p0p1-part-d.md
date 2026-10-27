# p0p1 part d: 01-react-fundamentals lessons 01-10 (reviewed 2026-10-22)
Scripts: /Users/todorbra/Projects/ReactLearning/tools/sandbox/scratch/p0p1-d/ (a,b,c,d .test.tsx via vitest+jsdom, jsx.mjs via TS 5.9). React 19.3.1.

Scope note: I targeted the risky/version-sensitive claims in each lesson and did not read every line of all 10 lessons.

- 01: StrictMode double render, no double in plain (b.test): confirmed. Version claims on render/hydrate removal and forwardRef: confirmed via upgrade guide/sandbox. Unresolved: exact release dates, react-reconciler API stability (left hedged).
- 02: StrictMode effect mount/cleanup/mount: confirmed (`A eff, A cleanup, A eff`).
- 03: batching in setTimeout = 1 render; same-value setState bail-out "may render once more": confirmed (one extra render then none). Unresolved: APG tabs URL (unfetched).
- 04: `$$typeof` = Symbol(react.transitional.element), element keys, frozen element/props, assignment throws TypeError: confirmed. CORRECTED: `element.ref` is removed (dev warning, still returns value), not "deprecated". `ref` in props for function components: confirmed. Unresolved: @types/react return-type notes, Dan Abramov URL.
- 05: new JSX transform required in 19: confirmed. key after spread falls back to createElement: confirmed with TS 5.9 (jsx and jsxDEV output). Key-spread dev warning: confirmed. CORRECTED: javascript: URLs are replaced with a throwing stub, not just warned. bigint child renders: confirmed. Promise child: unresolved on client (sandbox SSR suspends; hedge kept).
- 06: defaultProps removed for function components (renders "undefined"): confirmed. props.key read warns: confirmed. frozen props: confirmed.
- 07: children-prop bail-out (Wrapper only re-renders): confirmed. CORRECTED/verified Children.map empty nodes (callback called for false/null, index counts them; toArray drops). Context as provider `<C value>`: confirmed.
- 08: undefined return renders nothing: confirmed. Activity exists in 19.3.1, hidden cleans effects, keeps state: confirmed (marker removed).
- 09: key not a prop, spread-key warning: confirmed. toSorted/groupBy runtime support: unresolved (left as hedged).
- 10: SyntheticBaseEvent, nativeEvent, currentTarget null after dispatch, persist exists, capture/bubble ordering: confirmed. Passive touchstart/touchmove/wheel: confirmed in source (marker removed). useEffectEvent exists in 19.3.1 react (exported); status left hedged. Form actions: not executed (unresolved).
