# p9-d review: 09/08-react-compiler.md (2026-10-22)

Sources: react.dev learn/reference compiler pages (installation, incremental-adoption, debugging, compilationMode, panicThreshold, target, gating, logger, directives, use-memo, compiling-libraries, eslint-plugin-react-hooks + incompatible-library + preserve-manual-memoization), blog 2025/10/07 compiler v1.0, nextjs.org reactCompiler page, npm registry. Executed in `tools/sandbox/scratch/p9-d/` (babel-plugin-react-compiler 1.0.0, eslint-plugin-react-hooks 7.1.1, react-compiler-healthcheck 1.0.0, Vitest 3 + RTL; scripts: run.mjs, src/*.jsx, rc/*.test.jsx, vitest.config.mjs). All 56 warning markers removed (0 remain); 1 "unverified" label kept.

## Corrected (14)
1. Version status: lesson implied beta/volatile; now stable 1.0 (Oct 7 2025), plugin 1.0.0, React 19.3.
2. Vite config: `react({babel:{plugins}})` removed in @vitejs/plugin-react 6.0; now `reactCompilerPreset()` + `@rolldown/plugin-babel` (react.dev installation), old form kept for <6.
3. Next.js: `reactCompiler: true` is top-level since Next 16 (was experimental); babel-plugin-react-compiler must still be installed (nextjs.org).
4. ESLint: rules live in `eslint-plugin-react-hooks` (recommended/recommended-latest); `eslint-plugin-react-compiler` superseded (last release 19.1.0-rc.2).
5. Real compiled output differs from lesson's illustration (12 slots, one outer scope keyed [onSelect, products, query], filter callback/closure/`<ul>` separate scopes, sentinel `Symbol.for("react.memo_cache_sentinel")` for constants). Added real output note; B1 answer caveated (onSelect-only change re-runs filter in real output).
6. Mutation via `items.push(1)` / `sorted.sort()` on props: lesson said lint/bail-out expected; real: compiles with NO diagnostic and no lint error (undetected). Only `user.seen = true` ("This value cannot be modified"), ref access ("Cannot access refs during render"), `Date.now()` (purity) are flagged. `new Date()` and module-level `let` reads compile and are cached forever (sentinel). B2(b)/(d) answers fixed; (d) skipped only due to unsupported global `n++`.
7. Manual memoization: compiler skips component when it can't preserve it (`Existing memoization could not be preserved`, reproduced); useMemo with correct deps is compiled into cache scope.
8. Supported syntax: try/catch now compiles; inline `class` and global update expression are unsupported (reproduced).
9. panicThreshold: default `'none'`; `'critical_errors'`/`'all_errors'` fail the build (ref-access errors are "critical", reproduced). `target` is a string `'17'|'18'|'19'` (number throws); 17/18 import `c` from `react-compiler-runtime`, 19 from `react/compiler-runtime` (reproduced).
10. `sources`: not on react.dev; exists in plugin (default excludes node_modules; array of substrings or function works, tested). Documented route is Babel `overrides`. Hedged.
11. gating: output shape + evaluated once at module time (docs + reproduced). Module-level directives, `ignoreUseNoForget` (reproduced), `compilationMode` incl. `syntax` (Flow-only) added.
12. Render counts (§4.1) now measured: counter click plain {app1,list1,row5} vs compiled {app1}; toggle one todo compiled {app1,list1,row5}; with `memo(Row)` compiled row=1 vs plain 5. B3 confirmed (compiled parent: memo child 0 renders; plain: 1).
13. Library compat: `incompatible-library` lint (react-hook-form `watch`, TanStack `useReactTable`; MobX not detected). Compiling-libraries guidance (react-compiler-runtime in dependencies, `target`).
14. Resource links: replaced "unverified" notes (all returned HTTP 200), added 1.0 blog and RC blog.

## Confirmed
Compiler is build-time/Babel plugin; Rules-of-React contract; must run first in Babel plugins; "Memo ✨" DevTools badge; use memo/use no memo semantics and annotation-mode behavior (run); infer mode needs component/hook-like name + JSX/hook call (run: `util2` not compiled in infer, compiled in `all`); `"use no memo"` always wins (run); healthcheck exists (`npx react-compiler-healthcheck@latest`, run); property-path deps (`items.length`, `props.theme`, `options.a` seen); memoization after early return (ThemeProvider run); per-row closure not stable per row but whole list reused (run); useMemo/useCallback guidance (react.dev blog); Expo SDK 54+ default; no first-class SWC/oxc yet (Next uses SWC only for file selection); eslint rule names.

## Unresolved / hedged
- Server Components benefit: inference, labelled as such.
- Source-map/debugging experience (Symptom G): unverified.
- `sources` option stability (undocumented).
- Exact diagnostics wording and slot layout may change in later compiler releases.
- eslint-disable suppression behavior not tested (an `exhaustive-deps` disable comment before a function did not prevent compilation in my run; not documented in lesson).
- Did not test Vite/Next/Expo builds end to end (docs only).
