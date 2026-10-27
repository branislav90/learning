# p3 part 2: lessons 07-12 (03-react-state-and-hooks)

Date: 2026-10-22. Sources: react.dev reference pages (useLayoutEffect, useInsertionEffect, useMemo, memo, forwardRef, Profiler, StrictMode, eslint-plugin-react-hooks), React 19 / 19.2 / 19.3 posts, React 19 upgrade guide, React Compiler intro + v1.0 post, MDN (field-sizing, anchor-name). Executed tests: `tools/sandbox/scratch/p3/07-12/{a,b,c,d}.test.tsx`, `ssr.mjs` (React 19.3.1, jsdom, RTL). All 46 URLs in lessons 07-12 were fetched: 45 return 200, npmjs.com returns 403 to bots (unchanged).

## 07 You might not need an effect
- Derived state via Effect = 2 committed renders per click (`1/0`, `1/2`): confirmed (test a).
- Render-phase `setPrev(n)` unconditional loops to "Too many re-renders" even with unchanged value: confirmed; limit 25 found in react-dom source. Changed "exact limit implementation detail" to cite 25 + verification.
- Design 2 recomputes on unrelated keystroke (1 call), Design 3 `useMemo` 0: confirmed.
- Passive effects flushed synchronously after discrete event: confirmed (runs in microtask right after `click()` returns, before paint). Removed warning marker, added "confirmed".
- `<Activity>`: corrected hedge to stable since 19.2; hidden mode unmounts Effects (19.2 post).
- `useEffectEvent`: marked stable since 19.2 (was "experimental/changing"). Removed all warning markers.
- Unresolved: none.

## 08 useLayoutEffect
- SSR warning: React <=18 warned; React 19.3 `renderToString` prints nothing and the message string is absent from react-dom-server: corrected from "I believe ... verify" to verified; isomorphic-layout-effect workaround now only for React 18-. Updated the pitfall/E2/Q4 text accordingly. Note: react.dev useLayoutEffect page still carries the old troubleshooting entry.
- Order mutation -> ref -> layout -> passive, cleanup order on unmount (insertion, layout, ref, passive): confirmed (test a).
- Passive flush before paint after discrete event: confirmed, wording tightened (same task, microtask).
- `field-sizing` and CSS anchor positioning: MDN shows Baseline 2026 "newly available" (June 2026 / January 2026). Updated the CSS alternative text and E1 recommendation (anchor positioning now viable as primary for "latest two versions"; library as fallback).
- Hedged: exact minimum browser versions not checked (told reader to check MDN/caniuse).

## 09 useInsertionEffect
- Order/refs not attached in insertion effect: confirmed (test a, `ref=null` in insertion).
- **Corrected:** StrictMode's mount cycle does NOT re-run insertion effects (observed: only layout and passive get setup/cleanup/setup). Fixed the order note, B1 answer and the ref-counting remark that claimed "insert -> remove -> insert" under StrictMode.
- Docs caveats added: "may run before or after DOM updated", cleanup/setup interleaved per component.
- "React warns in dev when setting state": dev build contains "useInsertionEffect must not schedule updates." Cited.
- `<style href precedence>` / `<link precedence>` confirmed on react.dev style page.
- Library claim corrected: Emotion uses useInsertionEffect (published package checked); styled-components 6.6.0 does not reference it.
- Removed remaining warning markers (library/framework SSR guidance left hedged).

## 10 useRef
- `ref` as prop in function components, `forwardRef` still works, render-time ref null on mount: confirmed (test b). forwardRef doc wording: "no longer necessary... will be deprecated in a future release"; text updated.
- Ref callback cleanup, inline callback identity change (cleanup then re-attach; without cleanup: null then node): confirmed.
- StrictMode ref callback extra cycle: confirmed (`node, cleanup, node`; no-cleanup: `node, null, node`), documented on StrictMode page.
- TS implicit-return codemod `no-implicit-ref-callback-return`: confirmed in upgrade guide (was "verify name").
- B1 StrictMode ref-in-render: mount logs `1,2`, click `3,4`: confirmed; replaced "implementation detail, don't rely" with measured values (still labelled impl detail).
- usePrevious returns previous value: confirmed `[0,undefined],[1,0],[2,1]`.
- Compiler refs claim: eslint-plugin-react-hooks docs say compiler skips violating components and has a `refs` rule. Updated; `useEffectEvent` marked stable 19.2.

## 11 useMemo / useCallback
- StrictMode double-calls calculation (mount and update), 0 calls on unrelated update, React 19 reuses memoized callback from first pass: confirmed (test c); matches useMemo page and upgrade guide.
- Compiler section rewritten from "as I understand ... verify" to docs-backed statements: stable 1.0 Oct 2025; keep existing memoization; useMemo/useCallback remain escape hatches; supports React 17-19. `react.dev/learn/react-compiler` URL verified (200). reactwg/react-compiler URL 200.
- `<Context value>` version note retained, unverified marker removed (verified in 03 owner's lesson 13, not re-run here).

## 12 React.memo
- memo child receiving a new object prop re-renders (1); with a stable ref callback prop it skips (0); with an inline ref callback it re-renders (1): confirmed (test d). The lesson's claim about React 19 ref-as-prop defeating memo is now stated as verified.
- memo'd context consumer still re-renders on context change: confirmed.
- **Corrected:** Profiler claim: profiling is disabled in the production build by default (react.dev Profiler page); replaced the "verify" hedge.
- Compiler interplay rewritten as in 11.
- `arePropsEqual`/Object.is shallow compare consistent with memo page.

## Counts (claims checked)
Confirmed ~34, corrected/updated 11, hedged 2 (browser minimum versions, library SSR specifics), unresolved 0. About 85 warning markers removed across 07-12.
