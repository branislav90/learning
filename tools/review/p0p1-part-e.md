# p0p1 part E: 01-react-fundamentals lessons 11-20 (reviewed 2026-10-22)

Scratch: tools/sandbox/scratch/p0p1-e/ (a-e.test.tsx, ts/, cv/ = real create-vite scaffold). React 19.3.1, jsdom, vitest 3.

## Executed checks (React 19.3.1, createRoot + act)
- L12 5.1 impure counter: StrictMode shows 2 / 4; without StrictMode 1 / 2. CONFIRMED (added "verified").
- L12 3.1 / L17: Strict Mode order on mount `init,init,memo,memo,render,render,ref attach,setup,ref detach,cleanup,ref attach,setup`. Updater runs twice (`upd,upd`). useMemo factory runs twice total per render (reuse across the double render consistent with the React 19 upgrade guide). CONFIRMED; wording corrected (L12 3.1, L17 2.x: ref-callback re-run is documented on react.dev StrictMode).
- L13: `<Profiler onRender>` under StrictMode: mount + 1 click = 2 calls vs 4 component calls. CONFIRMED. react.dev/Profiler: disabled in production by default. CONFIRMED.
- L13 console dimming: React does not dim; DevTools does ("Hide logs during additional invocations in Strict Mode" setting exists). CORRECTED wording.
- L11 3.6 / L11 D4: after `<form action={fn}>` completes, uncontrolled defaultValue input reverts, controlled input keeps state value. CONFIRMED (marker removed, evidence added).
- L11 "Stuck" A/B warn, C/D editable: 2 console.error warnings for A, B. CONFIRMED.
- L10 3.3 ordering `React outer capture > native root > native inner > React inner bubble > React outer bubble > native document`. CONFIRMED. React stopPropagation does not stop native inner listener. CONFIRMED. onFocus bubbles; onScroll does not. CONFIRMED. touchstart/touchmove/wheel registered passive at root. CONFIRMED.
- L15: 84 result, n = 1 then 4 (updater queue), automatic batching in setTimeout (1 render), updater double-invocation in Strict Mode. CONFIRMED.
- L16: same-type/same-position preservation, different parent type resets state, nested component definition remounts input (new DOM node each keystroke). CONFIRMED. `<Activity>`: hidden children get `display: none !important`, state kept, effects cleaned up on hide and re-setup on show. CONFIRMED (stable since 19.2; markers removed).
- L17: effect order A,B,C mount / A,C on click; child effect before parent effect; Strict Mode effect cycle ABAB; leaky interval ticks 2/s in dev and keeps ticking after unmount. CONFIRMED.
- L14: `useEffectEvent` exported as function in react 19.3.1; react.dev reference page exists. CORRECTED (was "experimental/verify status"; now stable since 19.2).
- L19: snippet typechecked with tsc 5.9 strict; `step="2"` gives TS2322. CONFIRMED.
- Links: all 66 URLs in lessons 11-20 fetched with curl: HTTP 200 (except api.example.com placeholder and npmjs.com 403 bot block). "(unverified)" tags removed.

## L19 Vite setup: CORRECTED (largest drift)
Scaffolded `npm create vite@latest hello -- --template react-ts` (create-vite 9.3.1, Node ^20.19 || >=22.12): Vite ^8 (Rolldown), @vitejs/plugin-react ^6, TypeScript ~6.0, oxlint (`.oxlintrc.json`, `"lint": "oxlint"`, no eslint.config.js, no vite-env.d.ts, public/favicon.svg+icons.svg), tsconfig target es2023, erasableSyntaxOnly. Lesson updated: file tree, lint script, plugin-react description, bundler statement, ESLint section now framed as the earlier-template/optional route; react-hooks preset changed to `configs.flat.recommended` (v7 README). Note: TS 6.0 in template, TS 7.0 exists (not covered here).

## L18 DevTools
Verified from DevTools source/CHANGELOG (8.0.0, Sep 2026): label "Highlight updates when components render", "Record why each component rendered while profiling" (Settings > Profiler), "Always parse hook names from source". Added: Suspense tab on by default, Timeline tab removed in 8.0. Bug-icon label left hedged (could not locate). Not run in a real browser (no extension in sandbox): UI walkthrough steps UNRESOLVED as to exact current layout.

## Marker cleanup
Removed all remaining warning markers (⚠) in lessons 10-20 (10 included, assessed in same batch scope for L10). Where claims were not individually executed, existing prose hedges ("verify", "version-sensitive") remain.

## Unresolved / not executed
- Hydration-mismatch behaviour in React 19 (L12 D2/error reporting): not executed (no SSR hydration run); prose kept, left hedged.
- IME composition behaviour with controlled inputs, masked-input caret (L11): jsdom cannot reproduce; unresolved.
- Fast Refresh state-preservation (L19): not run in a browser.
- React Compiler claims (L12/L13): only checked that Compiler 1.0 is stable (react.dev blog) and babel-plugin-react-compiler 1.0.0 exists; not run.
- Newer-version note: React 19.3 (View Transitions, Fragment Refs) exists; not relevant to these lessons, no note added.
