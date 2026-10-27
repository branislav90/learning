# p0p1 part C: Phase 0 lessons 15-21 (reviewer changelog, 2026-10-22)

Scope was narrowed to risky, claim-bearing items. Most prose and browser/network claims in 15-17 were reviewed for plausibility but not machine-checked.

## Executed / sources
- tsc 5.9.3 + @types/react 19.3.0: scratch at tools/sandbox/scratch/p0p1-c/ (a.tsx; b/ holds every ts/tsx block from lessons 18-19 extracted and compiled).
- npm view vite (8.3.5), Vite 8 announcement and guides, react.dev CRA sunset post, TS erasableSyntaxOnly (tsc flag run), node 24 (AbortSignal.any/timeout exist).

## Lesson 15 (HTTP/caching)
- vite:preloadError event name: confirmed (Vite build guide). Marker removed.
- Cache-Control/bfcache/103/Navigation API/SW claims: plausible, not verified. **Unresolved**; markers kept.
## Lesson 16 (memory/GC): no changes; Strict Mode effect claim consistent with React docs. Engine-detail hedges left. Confirmed-by-inspection only.
## Lesson 17 (perf)
- INP good <= 200 ms at p75: consistent with web.dev (page states p75 methodology). Left hedged. V8 tier names, Long Tasks support, scheduler.yield: **unresolved**, markers kept.
## Lesson 18 (TS)
- filter(Boolean) not narrowing; filter(x => x !== undefined) narrows (5.5): confirmed by tsc. Marker removed.
- TS 5.4 closure narrowing after last assignment: confirmed (later reassignment re-widens). Markers removed.
- Remaining code blocks compile except intentional-error exercise snippets and fragments with missing declarations (Shape exhaustiveness fragment, stubs).
## Lesson 19 (TS generics/React types)
- useRef() requires argument, global JSX namespace removed, ReactElement props unknown, `<Ctx value>` and `<Ctx.Provider>` both valid: confirmed. Markers removed/updated.
- forwardRef/ref-as-prop, Strict Mode request count: consistent with React 19 docs; not run. Left.
## Lesson 20 (tooling) -- CORRECTED
- Vite described as esbuild-dev + Rollup-prod with Rolldown "in development": outdated. Vite 8 (current 8.3.x) ships Rolldown as the single bundler, Node ^20.19||>=22.12. Added version note, updated pipeline steps and comparison table.
- CRA deprecation: confirmed (react.dev, 2025-02-14). erasableSyntaxOnly in TS 5.8+: confirmed (flag works in 5.9.3).
- Dev proxy `ws: true`, manualChunks Rolldown compat: **unresolved**.
## Lesson 21 (assessment): removed marker on TS 5.5 inferred predicates (confirmed). Other answer keys not re-derived.

Totals: confirmed 10, corrected 1 (plus 3 hedge/version updates), unresolved ~8 (browser/HTTP-level claims).
