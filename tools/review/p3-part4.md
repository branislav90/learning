# p3 part 4 changelog: lessons 19-24 (react-mastery/03-react-state-and-hooks)

Reviewed 2026-10-22 against react.dev (useState-family reference pages, react-dom hooks, React 19 / 19.2 / 19.3 blog posts) and react/react-dom 19.3.1 in the sandbox. Scratch tests: `tools/sandbox/scratch/p3/p19-24/*.test.tsx` (run with `npx vitest run` from the sandbox dir).

## 22 Modern hooks and APIs
| Claim | How | Result |
|---|---|---|
| useEffectEvent stable (19.2), callable from useEffect/useLayoutEffect/useInsertionEffect/other Effect Events, identity unstable, not in deps | react.dev useEffectEvent page + 19.2 post | confirmed; removed hedges |
| useFormStatus returns `{pending,data,method,action}`, parent-form only, from `react-dom`; method default `get` | react.dev page; sandbox (pending=true, method=get, data=FormData; parent component pending=false) | confirmed |
| useActionState signature/permalink, queue order, throw cancels queue, not double-invoked in StrictMode | docs; sandbox (3 dispatches run sequentially with prev 0,1,11; single final render) | confirmed |
| Form reset after Action | React 19 post; sandbox (input returns to defaultValue) | confirmed |
| useDeferredValue `initialValue` | docs; sandbox (client logs `INIT` then value; renderToString emits only initialValue) | confirmed, wording sharpened |
| useDeferredValue inside a Transition | docs caveat; sandbox (`v=y d=y`, no extra render) | **corrected/added** (lesson omitted it) |
| Post-`await` setState not in transition | docs (still present in 19.3); sandbox | confirmed, hedge removed |
| useOptimistic: "update real state inside Action -> one commit, no flicker" | sandbox, 4 variants (transition fn, form action, wrapped/unwrapped) | **corrected**: unwrapped post-await `setTodos` gives `[] -> [a*] -> [a, a*] -> [a]` (duplicate row for a frame); wrapping in `startTransition` gives `[] -> [a*] -> [a]`. Example code, walkthrough, mermaid, troubleshooting entry and the wrong "item flashes away" explanation fixed |
| useOptimistic outside Action warns; message text | react-dom dev bundle | confirmed |
| useActionState outside-transition dev error text | react-dom dev bundle | confirmed |
| useId prefix | 19.2 post + sandbox (`_r_0_` client, `_R_1_` renderToString) | confirmed/clarified (`:r:` 19.0, `«r»` 19.1, `_r_` 19.2+); added doc caveat: don't use useId for `use()` cache keys |
| use(): no try/catch, promise must be cached, context not supported in Server Components, serializable promise values | docs | confirmed |
| Uncached `use(new Promise)` in client render | sandbox: suspends (act warnings); not asserted further | partially checked |
| Typecheck of code blocks | tsc on extracted blocks | no API type errors (syntax-only failures are intentional signature snippets) |
Banner replaced with a verified version note (19.3 added ViewTransition and Fragment refs, no changes to these hooks). All warning markers removed.

## 20 useSyncExternalStore
- getSnapshot not cached: sandbox confirmed "The result of getSnapshot should be cached to avoid an infinite loop" then "Maximum update depth exceeded" (confirmed).
- Missing getServerSnapshot on server: "Missing getServerSnapshot, which is required for server-rendered content" (confirmed).
- Hydration with different client snapshot: no mismatch error, re-renders to client value (confirmed).
- StrictMode subscribe/unsubscribe balances to 1 active subscription (confirmed).
- Selector store example: coupon change causes 0 re-renders of the badge, qty change 1 (confirmed).
- Sync/non-transition caveat and docs-recommended second getSnapshot call before DOM commit (confirmed against docs; added the second-call detail).
- Zustand 5 and react-redux 9 use useSyncExternalStore (grep in node_modules); sentence rewritten from a hedge to a statement.
- Removed 6 warning markers and a "(verify URL)".

## 24 Phase assessment
- B1 (3, one extra render), B2 order, B3 (StrictMode `connect a, disconnect a, connect a` then `disconnect a, connect b`), B4 (`timeout 0`, `timeout 1`), B5 (only Row b), B6 (no log for constant value; log for object value), B7 (uncached error then max depth), B8 (3, prev 0 then 1, sequential): executed, all confirmed.
- C5 form-reset behaviour: executed, confirmed (cleared without defaultValue, shows returned value with it); hedge replaced by a verified note.
- useEffectEvent availability note updated (stable since 19.2). Markers removed.
- Unresolved: D/E rubric answers are judgement content, not executed.

## 21 Forms and complex state
- Uncontrolled reset after Action: documented in React 19 post; sandbox confirmed, including after a returned validation error.
- `requestFormReset(form)`: exists in react-dom 19.3.1, works inside `startTransition` (executed); no dedicated react.dev reference page (the guessed URL 404s), now stated.
- Thrown error in a form Action goes to the Error Boundary (executed).
- `defaultValue={state.email}` pattern works without a `key` (executed); the `key` hack is now described as optional.
- Form-library notes: URLs resolve (React Hook Form, TanStack Form via /form/latest); removed vague "verify" tags. Library behaviour claims unresolved (not tested).

## 23 Hooks anti-patterns
- React Compiler: 1.0 stable since Oct 2025, opt-in, React 17+ compatible, useMemo/useCallback remain an escape hatch (react.dev blog + intro page). Updated 5 hedged mentions.
- useLayoutEffect on server: renderToString emits no warning in 19.3.1 (executed); text updated.
- Inline ref callback: `el, null, el` across re-render; with a cleanup return the cleanup replaces the null call (executed).
- renderHook is exported by RTL 16 (checked types).
- B4 render-phase setState answers executed: `setA(x)` unconditional throws "Too many re-renders" even when equal; guarded pattern renders twice and settles (confirmed).
- Link `react-developer-tools` resolves (200).

## 19 UI, server, URL and shared state
- Hydration with differing server snapshot (used by the hand-rolled URL hook): confirmed no mismatch error.
- Navigation API: MDN shows "Baseline 2026, newly available"; text updated.
- Router/library API claims (React Router, Next, TanStack Router) not executed: **unresolved**, left as general pointers to current docs. TanStack Query "section names" tag removed (not checked).
