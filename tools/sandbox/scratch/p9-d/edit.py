import sys
p="/Users/todorbra/Projects/ReactLearning/react-mastery/09-advanced-rendering-and-ecosystem/08-react-compiler.md"
t=open(p).read()
def R(old,new,count=1):
    global t
    if t.count(old)!=count:
        print("MISMATCH",t.count(old),repr(old[:70])); sys.exit(1)
    t=t.replace(old,new)

R("""> ⚠ **HIGH-VOLATILITY LESSON: verify against current docs.** React Compiler is a build-time tool whose package names, configuration options, supported toolchains (Babel, Vite, Next.js, SWC, Metro), default behaviors, lint-rule names, and compatibility lists have changed repeatedly since its public beta and **continue to change**. Everything in this lesson about *what the compiler guarantees conceptually* (it relies on the Rules of React and preserves behavior for code that follows them) is stable. Everything about *flags, plugin names, versions, supported bundlers, which libraries are compatible, and what the output looks like* must be re-verified on <https://react.dev/learn/react-compiler> and the compiler's repository before you act on it. Statements below marked ⚠ are the ones most likely to be out of date.""",
"""> **HIGH-VOLATILITY LESSON.** **Status (verified 2026-10-22):** React Compiler reached **v1.0 stable on Oct 7, 2025** ([announcement](https://react.dev/blog/2025/10/07/react-compiler-1)); `babel-plugin-react-compiler` is at `1.0.0` on npm (`latest`), and React is at 19.3. The earlier beta (Oct 2024) and RC (Apr 2025) phases are over. Package names, option names and defaults, directives, DevTools badge and lint-rule names below were checked against react.dev and by **running `babel-plugin-react-compiler@1.0.0`** (and `eslint-plugin-react-hooks@7.1.1`) on this lesson's examples. What remains volatile is the *generated output shape*, the exact diagnostics wording, bundler integrations and the incompatible-library list: re-check <https://react.dev/learn/react-compiler> before you act on those. Statements marked ⚠ are the ones that could not be fully verified.""")

R("compilation modes (`infer`, `annotation`, `all`) ⚠, directives (`\"use memo\"`, `\"use no memo\"`) ⚠, targets for React 17/18 ⚠, ESLint integration ⚠, DevTools indicators ⚠, health check ⚠,",
  "compilation modes (`infer`, `annotation`, `syntax`, `all`), directives (`\"use memo\"`, `\"use no memo\"`), targets for React 17/18, ESLint integration, DevTools indicators, health check,")
R("as if you had added `useMemo`, `useCallback`, and `React.memo` perfectly and at fine granularity.** ⚠ (conceptual description; verify the exact wording and guarantees on react.dev)",
  "as if you had added `useMemo`, `useCallback`, and `React.memo` perfectly and at fine granularity.** (Conceptual description; react.dev says it \"optimizes your React app through automatic memoization\" and focuses on *update* performance: skipping cascading re-renders and skipping expensive calculations inside components/hooks.)")
R("leaving it unoptimized rather than risking incorrect behavior ⚠ (some violations might not be detected; see §3.6).",
  "leaving it unoptimized rather than risking incorrect behavior (some violations are *not* detected, notably in-place mutation through methods such as `push`/`sort` on props; see §3.6).")
R("It targets components/hooks; Server Components rarely re-render in the same way, so benefits are mainly client components ⚠ |",
  "It optimizes components and hooks (React and React Native), focused on *re-rendering*; Server Components do not re-render on the client, so the benefit is mainly for client components (inference, not a documented statement) |")
R("Guidance (⚠ verify current wording) is to prefer relying on the compiler for new code, keep existing memoization (removing can change compiled output), and use manual hooks when you need *explicit control*, e.g., stable effect dependencies.",
  "Guidance (react.dev, Oct 2025): for new code rely on the compiler and use `useMemo`/`useCallback` where you need precise control; for existing code either leave existing memoization in place (removing it can change compilation output) or test carefully before removing it. A common legitimate use is a memoized value used as an effect dependency.")
R("It targets function components and hooks only ⚠ |","It only memoizes React components and hooks (not arbitrary functions, and not class components) |")
R("**Implementation detail ⚠** names of passes and exact output change. To go deeper, read the compiler's source in the React repository (the compiler package lives under the repository's compiler directory ⚠ verify path) and its documentation.",
  "**Implementation detail** names of passes and exact output, which change between releases. To go deeper, read the compiler's source: <https://github.com/facebook/react/tree/main/compiler> (package `compiler/packages/babel-plugin-react-compiler`, path verified) and try the Playground linked from react.dev.")
R("### 3.1 Public guarantees (as documented; verify)","### 3.1 Public guarantees (as documented on react.dev, verified 2026-10-22)")
R("""3. It can be adopted **incrementally** (per directory/file/component), with escape hatches for opting out ⚠ (directives such as `"use no memo"`; opt-in via `"use memo"` in annotation mode).
4. It's compatible with React 19 and, via a runtime package and a `target` setting, with React 17 and 18 ⚠ verify current support statement.
5. It ships ESLint rules (integrated into the standard React hooks ESLint plugin in recent versions ⚠ verify; previously a separate plugin) that flag violations the compiler cares about.
6. React DevTools indicates which components were optimized by the compiler ⚠ (a badge in the component tree).
7. A health-check command analyzes a codebase for compatibility ⚠ (`react-compiler-healthcheck`; verify name/usage).""",
"""3. It can be adopted **incrementally** (Babel `overrides` per directory, `compilationMode: 'annotation'` + `"use memo"`, runtime `gating`), with escape hatches for opting out (`"use no memo"`).
4. It is compatible with React 19 and, via the `react-compiler-runtime` package and the `target` option (`'17'`, `'18'`, `'19'`; default `'19'`), with React 17 and 18. React 19 output imports `c` from `react/compiler-runtime`; `target: '17' | '18'` output imports it from `react-compiler-runtime` (I confirmed both import lines by running the plugin).
5. Its lint rules ship inside **`eslint-plugin-react-hooks`** (v6+/7.x; rules such as `immutability`, `refs`, `purity`, `set-state-in-effect`, `set-state-in-render`, `static-components`, `preserve-manual-memoization`, `incompatible-library`, `unsupported-syntax` in the `recommended` / `recommended-latest` presets). The separate `eslint-plugin-react-compiler` is superseded: the v1.0 announcement says to remove it and use `eslint-plugin-react-hooks@latest` (its last npm release is `19.1.0-rc.2`). The lint rules do not require the compiler to be installed.
6. React DevTools shows a **"Memo ✨"** badge next to components optimized by the compiler (react.dev installation guide).
7. A health-check package exists: `react-compiler-healthcheck` (1.0.0). `npx react-compiler-healthcheck@latest [--src "<glob>"]` reports "Successfully compiled N out of M components", whether StrictMode is used, and whether known-incompatible libraries are used (I ran it).""")
R("are dropped or merged to avoid overhead ⚠ heuristics.","are dropped or merged to avoid overhead (heuristics; in the real output below, the filter callback, the `.filter().map()` computation and the `<ul>` are separate scopes).")
R("""Conceptually compiled (hand-simplified; real output differs and is not public API ⚠):

```js
import { c as _c } from "react/compiler-runtime";        // cache hook ⚠ name/location is implementation detail""",
"""Conceptually compiled (**hand-simplified teaching version**; the real output, shown after the explanation, differs and is not public API):

```js
import { c as _c } from "react/compiler-runtime";        // cache hook: name/location is an implementation detail""")
R("""**Why this matters:** manual equivalent would need""","""**Real output.** I compiled this exact component with `babel-plugin-react-compiler@1.0.0` (default options, executed 2026-10-22). It differs from the simplification above: `const $ = _c(12)` (12 slots); the arrow `p => p.name.includes(query)` is its own scope keyed on `query` (slots 4–5); **one outer scope** keyed on `[onSelect, products, query]` (slots 0–3) contains the `filter`, the `handleClick` closure (keyed on `onSelect`, slots 6–7), the row-render callback (keyed on `handleClick`, slots 8–9) and the `visible.map(...)` result; and the `<ul>` element is a final scope keyed on the mapped array (slots 10–11). Consequently, in the *real* output a change to only `onSelect` re-runs the filter as well, because the filter sits inside the outer scope. Constants and elements with no reactive inputs are cached with a sentinel check instead: `if ($[0] === Symbol.for("react.memo_cache_sentinel"))` (this is the output shown in react.dev's installation guide for a static `<div>Hello World</div>`). Treat slot numbers and scope boundaries as opaque.

**Why this matters:** manual equivalent would need""")
R("(e.g., depending on `props.user.name` rather than all of `props` ⚠ verify the exact granularity). Consequently:",
  "(e.g., depending on `props.user.name` rather than all of `props`). Verified: v1.0 supports optional chains and array indices as dependencies (react.dev announcement), and my runs show property-path keys such as `$[0] !== items.length`, `$[0] !== props.theme` and `$[0] !== options.a`. Consequently:")
R("⚠ The precision of this inference is an implementation detail and differs between versions; do not design around it.","The precision of this inference is an implementation detail and has changed between releases (it was improved in 1.0); do not design around it.")
R("""| `useMemo(() => compute(a), [a])` | Compiler can preserve it and may also memoize around it; it validates that your manual dependencies match its inference and may *skip optimizing the component* if it detects inconsistencies (e.g., missing deps) ⚠ the validation behavior is evolving; keep `exhaustive-deps` lint clean |""",
"""| `useMemo(() => compute(a), [a])` | Compiler preserves the memoization guarantee (in the real output the `useMemo` wrapper is compiled into its own cache scope keyed on the same inputs) and validates that your manual dependencies match its inference. If it cannot prove it preserves your memoization (e.g., missing deps) it **skips the whole component**: I ran a `useMemo(..., [data])` that reads `filter` and the logger reported `CompileError :: Existing memoization could not be preserved`; the `preserve-manual-memoization` lint rule reports the same. Keep `exhaustive-deps` clean |""")
R("so effects fire less often: **a behavior change** if your code accidentally relied on re-running ⚠ |","so effects fire less often: **a behavior change** if your code accidentally relied on re-running (react.dev's debugging guide lists \"effects over-firing, infinite loops, or missing updates\" as the typical breakage when code relied on memoization for correctness) |")
R("Practical guidance from the docs (⚠ verify): don't mass-remove","Practical guidance from the docs (react.dev/blog v1.0, verified): don't mass-remove")
R("""- Constructs outside its supported subset ⚠ (the supported syntax set grows; older limitations included certain `try/catch` shapes and some `eval`-like/dynamic patterns).
- Hook call violations; non-component functions with component-like names used inconsistently.
- Explicit opt-out via directive.""",
"""- Constructs outside its supported subset (the set grows). Observed with 1.0.0: an inline `class` declaration inside a component (`Inline \\`class\\` declarations are not supported`) and an update expression on a module-level variable (`n++`: `Support UpdateExpression where argument is a global`) both made it skip the component; a `try { } catch { return <i/> }` component *did* compile (an older limitation that no longer applies).
- Hook call violations; non-component functions with component-like names used inconsistently.
- Manual memoization it cannot preserve (`Existing memoization could not be preserved`, see §3.5).
- Explicit opt-out via directive (`CompileSkip` in the logger).
- In `infer` mode, functions that do not look like components/hooks (name must be PascalCase or `use…` **and** the function must create JSX and/or call hooks): such functions are simply not considered.
- Reported diagnostics seen in my runs: `This value cannot be modified` (assigning to a prop field, `user.seen = true`) and `Cannot access refs during render` (reading/writing `ref.current`). With the default `panicThreshold: 'none'` both only skip the component; with `'critical_errors'` or `'all_errors'` the ref errors **fail the build**.""")
R("""Two outcome classes (important):
1. **Detected violation → skipped component:** safe; you lose optimization; lint/diagnostics tell you why.
2. **Undetected violation → behavior drift:** e.g.,""","""Two outcome classes (important):
1. **Detected violation → skipped component:** safe; you lose optimization; lint/diagnostics tell you why.
2. **Undetected violation → behavior drift.** Verified examples that **compiled with no diagnostic and no lint error** in 1.0.0 / `eslint-plugin-react-hooks` 7.1.1: `items.push(1)` on a prop array, `sorted.sort(...)` on an alias of a prop, reading a mutable module-level `let` (cached forever behind the sentinel), and `new Date().toLocaleTimeString()` in render (cached forever; note `Date.now()` *is* flagged by the `purity` rule, `new Date()` is not). react.dev's debugging guide states the same limit: runtime issues come from violations \"the compiler couldn't detect\". E.g.,""")
R("The compiler docs and lint rules maintain a list of known incompatible/risky APIs ⚠ (examples cited in discussions have included form libraries with `watch`-style APIs, and table libraries returning unstable-but-mutable objects).",
  "The `incompatible-library` lint rule (in `eslint-plugin-react-hooks`) flags usages from a known list; react.dev's examples are react-hook-form's `watch()` (use `useWatch` instead) and TanStack Table's `useReactTable` (the table instance uses interior mutability). MobX `observer` also breaks memoization assumptions but is **not yet detected** by the linter; use `\"use no memo\"` there.")
R("### 3.7 Third-party libraries ⚠","### 3.7 Third-party libraries")
R("**Verify the current list** in the docs/lint output; it changes.","The list is maintained by the plugin and changes between releases; check the lint output for your versions.")
R("""the compiler caches the whole mapped array as one scope with `todos` as input, so the entire list recomputes when `todos` changes ⚠), then""","""the compiler caches the whole mapped array as one scope with `todos` as input, so the entire list recomputes when `todos` changes; confirmed in the real output), then""")
R("""For the biggest gains on large lists, keep `React.memo` on row components ⚠ (verify guidance: the docs show the compiler can memoize row components, but call-site list-level memoization has limits).""",
"""**Measured** (Vitest + RTL, 5 rows, `scratch/p9-d/rc`): *click the counter*: plain build re-renders `App` 1, `TodoList` 1, rows 5; compiled build re-renders `App` 1, `TodoList` 0, rows 0. *Toggle one todo*: plain `App` 1 / `TodoList` 1 / rows 5; compiled `App` 1 / `TodoList` 1 / **rows 5** (all row functions are still called because each row's element is new). Adding `React.memo` to the row component: plain build still renders 5 rows (a fresh `toggle` each render), compiled build renders **1** row. So for large lists, keep (or add) `React.memo` on row components.""")
R("With compiler: a lint warning/bail-out is expected; if undetected, a cached `<List>` could show a stale order, because `items` reference didn't change while its contents did.",
  "With compiler: **no bail-out and no lint error** (I compiled this exact component with 1.0.0 and linted it with `eslint-plugin-react-hooks` 7.1.1: `CompileSuccess`, zero diagnostics; contrast with `user.seen = true`, which is flagged). So the mutation is undetected; the compiler caches `<List items={sorted}/>` keyed on the `items` reference, which didn't change while its contents did, so downstream output can be stale.")
R("### 5.1 Minimal: enabling the compiler (illustrative; ⚠ verify per toolchain)","### 5.1 Minimal: enabling the compiler (verified against react.dev 2026-10-22)")
R("""# Illustrative; package names/versions change: check react.dev/learn/react-compiler
npm install --save-dev --save-exact babel-plugin-react-compiler@latest
```

```ts
// vite.config.ts (illustrative ⚠ verify against current docs and your plugin-react version)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", { /* options ⚠ */ }]],
      },
    }),
  ],
});
```

Notes: the compiler's Babel plugin should run **first** in the Babel plugin list so it sees the original source ⚠ (docs state ordering constraints). Frameworks often expose a single switch (`reactCompiler: true`-style) ⚠ verify in your framework docs. Some toolchains (SWC-based) have partial/experimental support ⚠.""",
"""npm install --save-dev --save-exact babel-plugin-react-compiler@latest
```

```ts
// vite.config.ts: @vitejs/plugin-react >= 6 (current: 6.1.x). The inline `babel` option was REMOVED in 6.0.0;
// react.dev's recommended setup is a preset applied through @rolldown/plugin-babel:
//   npm install -D @rolldown/plugin-babel
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
});

// Older plugin-react (< 6): react({ babel: { plugins: [["babel-plugin-react-compiler", { /* options */ }]] } })
```

Notes:
- The compiler's Babel plugin must run **first** in the Babel plugin list (react.dev: "the compiler needs the original source information"), i.e. `plugins: ['babel-plugin-react-compiler', /* others */]`.
- **Next.js:** `reactCompiler: true` in `next.config.ts` (top-level since Next 16, where it was stabilized; it was `experimental.reactCompiler` before). You **still install `babel-plugin-react-compiler`** (`npm i -D babel-plugin-react-compiler`); Next.js runs a custom SWC pass that only decides *which files* are relevant, and the compiler itself still runs as the Babel plugin, so builds are slightly slower. Options are passed as an object, e.g. `reactCompiler: { compilationMode: 'annotation' }`. Source: nextjs.org/docs reactCompiler page.
- **Expo:** SDK 54+ has the compiler enabled by default for new apps. **Metro/React Native:** Babel via Metro, so use the Babel setup. **Rspack/Rsbuild:** documented in their own docs. **Webpack:** community loader. **React Router:** `vite-plugin-babel`.
- **SWC/oxc:** there is no first-class SWC or oxc compiler yet; react.dev says the team is working with the swc and oxc teams on it, and that the initial stable version remains a Babel plugin.
- `create-vite` and `create-next-app` offer compiler-enabled templates.""")
R("### 5.2 Practical: incremental adoption configuration (⚠ option names verify)","### 5.2 Practical: incremental adoption configuration (option names verified in the plugin source and by running it)")
R("""      compilationMode: "annotation",      // only compile components/hooks that opt in with "use memo" ⚠
      // target: "18",                    // for React 17/18 you also need the runtime package ⚠
      // sources: (filename) => filename.includes("src/features/checkout"),   // restrict by path ⚠
    }],""","""      compilationMode: "annotation",      // 'infer' (default) | 'annotation' | 'syntax' (Flow only) | 'all'
      // target: "18",                    // '17' | '18' | '19' (default '19', a STRING); 17/18 also need `npm i react-compiler-runtime@latest` as a dependency
      // panicThreshold: "none",          // default; 'critical_errors' | 'all_errors' fail the build
      // sources: (filename) => filename.includes("src/features/checkout"),   // exists in the plugin (default skips node_modules; an array of path substrings also works) but is not documented on react.dev; the documented route is Babel `overrides`
    }],""")
R("""// opt a component in (annotation mode) ⚠""","""// opt a component in (annotation mode, or to force compilation in infer mode)""")
R("""// opt a component out (any mode) ⚠""","""// opt a component out (any mode; always wins over compilationMode)""")
R("""Rollout ladder: (1) health check + lint; (2) `annotation` mode on a handful of hot components; (3) directory-level `sources` for modern, well-tested features;""","""Directives also work at **module level** (a `"use memo"` / `"use no memo"` string at the very top of the file), and a function-level directive overrides it (react.dev, directives reference). `ignoreUseNoForget: true` makes the plugin ignore `"use no memo"` (I confirmed it compiles an opted-out function). For runtime A/B rollout use `gating: { source, importSpecifierName }`; the compiler then emits `isOn() ? function Plain(t0){ /* compiled */ } : function Plain({a}){ /* original */ }` and the gate is evaluated **once at module evaluation time**, so it is static for the browser session (react.dev, and confirmed in the output).

Rollout ladder: (1) health check + lint; (2) `annotation` mode on a handful of hot components; (3) directory-level Babel `overrides` (or `sources`) for modern, well-tested features;""")
R("""The compiler can't make *per-row* closures identical across renders for different `o` unless it memoizes inside the loop scope ⚠ granular behavior; the common""","""In the real output (executed) the whole `rows.map(...)` result is one scope keyed on `[orders, filter, onOpen]` and the per-row closure is created inside the callback, so it is **not** stable per row, but the entire list (and the `<table>`) is reused whenever those three inputs are unchanged. The common""")
R("**Consequences:** lint errors; compiler skips the component (or caches a stale timestamp).","**Consequences (executed):** `react-hooks/immutability` (\"This value cannot be modified\"), `react-hooks/purity` (`Date.now` is impure) and `react-hooks/refs` (\"Cannot access refs during render\") errors, and the compiler logs `CompileError` and skips the component.")
R("""With the compiler, `Card`'s output depends on a value it can't see change: the compiler may treat `currentTheme` as non-reactive and cache the element forever.""","""With the compiler, `Card`'s output depends on a value it can't see change: **verified**: the compiled output wraps `<div className={currentTheme}>` in `if ($[0] === Symbol.for("react.memo_cache_sentinel"))`, i.e. the element is computed once per component instance and reused forever; there was no lint error or compile diagnostic.""")
R("// 1) DevTools: look for the compiler badge on components (⚠ UI may differ by version).","// 1) DevTools: look for the \"Memo ✨\" badge on components (react.dev installation guide; dev builds).")
R("Add a CI job that runs the test suite with the compiler enabled **and** disabled during rollout","In my experiment the same component produced render counts of `{app:1, list:1, row:5}` (plain) vs `{app:1}` (compiled) for an unrelated state change, so such assertions do differ. Add a CI job that runs the test suite with the compiler enabled **and** disabled during rollout")
R("| Needs build-tool integration | Yes ⚠ |","| Needs build-tool integration | Yes (Babel plugin) |")
R("| Debuggability | Compiled output differs from source ⚠ |","| Debuggability | Compiled output differs from source |")
R("libraries can ship precompiled output or manual memoization ⚠ verify the library guidance in the docs.","libraries can ship precompiled output (react.dev \"Compiling Libraries\": add the Babel plugin to the library build; for React < 19 also depend on `react-compiler-runtime` in `dependencies` (not dev) and set `target` to the minimum supported React major; test with and without compilation) or manual memoization.")
R("1. **Start with the health check and lint** (⚠ verify tool names)","1. **Start with the health check (`npx react-compiler-healthcheck@latest`) and lint (`eslint-plugin-react-hooks` `recommended`)**")
R("10. **Track library compatibility notes** per release ⚠.","10. **Track library compatibility notes** per release (the `incompatible-library` lint rule).")
R("| Depending on compiler output shape or cache hook names | Internal and unstable ⚠ | Treat as opaque |","| Depending on compiler output shape or cache hook names | Internal and unstable | Treat as opaque |")
R("Some filter components use form/table libraries ⚠ with compatibility caveats;","Some filter components use form/table libraries (react-hook-form `watch`, TanStack Table `useReactTable` are flagged by `incompatible-library`);")
R("Form libraries with mutable proxies/`watch` ⚠: verify compatibility;","Form libraries with mutable proxies/`watch` (react-hook-form: use `useWatch`): verify compatibility;")
R("Library authors can ship compiled artifacts or rely on consumers ⚠;","Library authors can ship compiled artifacts or rely on consumers;")
R("Version compatibility matrix (React 17/18/19 targets ⚠);","Version compatibility matrix (React 17/18/19 targets);")
R("check the compiler's diagnostics output (logger option ⚠);","check the compiler's diagnostics output (the `logger.logEvent(filename, event)` option: `CompileSuccess`, `CompileError` with `event.detail.reason`, `CompileSkip`, `CompileDiagnostic`, `PipelineError`, `Timing`);")
R("or run the lint rules","or run the lint rules",0) if False else None
R("library API returning stable identity with changing behavior ⚠,","library API returning stable identity with changing behavior,")
R("source maps help but stepping can be confusing ⚠.","source maps help but stepping can be confusing (unverified).")
R("**Investigation:** run the lint rules for the component;","**Investigation:** look for the missing \"Memo ✨\" badge; run the lint rules for the component;")
R("C3. Write a test harness that runs the same Vitest suite twice (compiler on/off) and diffs the results, describing build configuration (illustrative; mark ⚠ verify).","C3. Write a test harness that runs the same Vitest suite twice (compiler on/off) and diffs the results, describing build configuration.")
R("(docs warn it may skip optimizing mismatched components ⚠)","(the compiler skips components whose manual memoization it cannot preserve)")
R("""**B1.** `query` changes: scope for `visible` recomputed""","""**B1.** (Answered for the simplified §3.3 output; the real 1.0.0 output groups the filter, closure and map into one outer scope, so there any change to `products`, `query` or `onSelect` re-runs the filter and the map, and only the inner callbacks/`<ul>` have their own slots.) `query` changes: scope for `visible` recomputed""")
R("Two Vitest configs: base and compiler-enabled (Babel plugin via the React plugin options ⚠).","Two Vitest configs: base and compiler-enabled (a small Vite `transform` plugin that runs `@babel/core` with `babel-plugin-react-compiler`, or `@rolldown/plugin-babel` with `reactCompilerPreset()`; I used the former, see `tools/sandbox/scratch/p9-d/vitest.config.mjs`).")
R("compiled output requires runtime support for older React via target/runtime package ⚠;","compiled output requires runtime support for older React via `target` plus the `react-compiler-runtime` dependency;")
R("evaluates shipping compiled builds only with a verified matrix and tests across React 17/18/19 ⚠.","evaluates shipping compiled builds only with a verified matrix and tests across React 17/18/19 (react.dev's \"Compiling Libraries\" guide supports this, with `target` set to the minimum React version).")
R("""| React docs — React Compiler | <https://react.dev/learn/react-compiler> | Official overview, installation, incremental adoption, troubleshooting ⚠ most volatile page: re-read often | Int–Adv | Whole section |
| React docs — React Compiler reference (configuration, directives) | <https://react.dev/reference/react-compiler/configuration> | Options such as `compilationMode`, `target` *(unverified path; navigate from the React Compiler section)* | Adv | Configuration, directives |""",
"""| React docs — React Compiler | <https://react.dev/learn/react-compiler> | Official overview, installation, incremental adoption, debugging (all fetched 2026-10-22) | Int–Adv | Whole section |
| React docs — React Compiler reference | <https://react.dev/reference/react-compiler/configuration> | `compilationMode`, `gating`, `logger`, `panicThreshold`, `target`, directives, Compiling Libraries (all verified) | Adv | Configuration, directives |
| React blog — React Compiler v1.0 | <https://react.dev/blog/2025/10/07/react-compiler-1> | Stable release, ESLint merge, memoization guidance | Int | Whole post |""")
R("| React Compiler repository directory | <https://github.com/facebook/react/tree/main/compiler> | Source, README, issues for compatibility discussions *(path unverified; verify layout)* | Expert | README, packages |","| React Compiler repository directory | <https://github.com/facebook/react/tree/main/compiler> | Source, README, issues for compatibility discussions (path verified) | Expert | README, packages |")
R("| React blog — React Compiler announcements | <https://react.dev/blog> | Release notes and the version history; look for React Compiler beta/RC/1.0 posts *(titles/dates not verified)* | Int | Search \"Compiler\" |","| React blog — compiler beta and RC | <https://react.dev/blog/2025/04/21/react-compiler-rc> | Release-candidate post (URL verified; the beta post is linked from the 1.0 announcement) | Int | Whole post |")
R("| React Conf talks on React Compiler | <https://conf.react.dev/> | Deep dives by the team *(unverified specific talk URLs)* | Adv | Compiler talks |","| React Conf talks on React Compiler | <https://conf.react.dev/> | Deep dives by the team (site verified; specific talk URLs not) | Adv | Compiler talks |")
R("| eslint-plugin-react-hooks | <https://www.npmjs.com/package/eslint-plugin-react-hooks> | Lint rules (including compiler-related) ⚠ verify rule names and presets | Int | README |","| eslint-plugin-react-hooks | <https://react.dev/reference/eslint-plugin-react-hooks> | Lint rules including the compiler-powered ones (rule names verified; presets `recommended` / `recommended-latest`) | Int | Recommended rules |")
R("| React DevTools | <https://react.dev/learn/react-developer-tools> | Compiler badge, Profiler | Int | Components, Profiler |","| React DevTools | <https://react.dev/learn/react-developer-tools> | \"Memo ✨\" compiler badge, Profiler | Int | Components, Profiler |")
R("Links marked *(unverified)* were not fetched in this session. **Because this tool evolves, treat any blog post older than a few months as potentially outdated.**","All URLs above returned HTTP 200 on 2026-10-22 except where noted. **Because this tool evolves, treat any blog post older than a few months as potentially outdated.**")
R("⚠ **Reminder:** before relying on any compiler option, directive, plugin name, or compatibility claim above, confirm it against the current official documentation and the version you intend to ship.",
  "**Reminder:** options and defaults here were verified against `babel-plugin-react-compiler@1.0.0` and react.dev on 2026-10-22; if you ship a later compiler release, re-check the changelog, especially generated-output shape, diagnostics wording and the incompatible-library list.")
open(p,"w").write(t)
print("ok")
