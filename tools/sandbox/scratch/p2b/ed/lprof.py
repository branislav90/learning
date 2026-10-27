from apply import apply
NOTE="Executed on react 19.3.1: `onRender` also fires when the `<Profiler>` element itself is re-rendered by its parent, even if every descendant bails out (`updateProfiler` in `ReactFiberBeginWork.js` sets the `Update` flag unconditionally; the call reported `actualDuration` of about 0.01 ms for a `memo` child that did not run)."
apply('30-react-devtools-profiler.md', [
("the `<Profiler>` component's `onRender` callback fires after each commit that includes changes in its subtree.","the `<Profiler>` component's `onRender` callback fires after each commit in which the Profiler or something in its subtree rendered. "+NOTE),
("(Profiler `onRender` is invoked only when a descendant in *its* subtree rendered)","(Profiler `onRender` fires when a descendant in its subtree rendered *or when the Profiler itself is re-rendered by its parent*, so to make this assertion meaningful the profiled list must sit behind a boundary the keystroke does not re-render, for example a `memo` wrapper that contains the `<Profiler>`; with the Profiler directly in the re-rendering parent, `commits` still increments with `actualDuration` near 0)"),
("**B1.** Once. `onRender` fires once per commit that includes changes in the Profiler's subtree; it is not per-component.","**B1.** Once. `onRender` fires once per commit in which the Profiler's subtree (or the Profiler itself) rendered; it is not per-component."),
])
apply('29-reasoning-about-unnecessary-renders.md', [
("`<Profiler onRender>` fires once per commit that touches the subtree,","`<Profiler onRender>` fires once per commit in which the Profiler or its subtree rendered (it also fires when its parent re-rendered the Profiler element while all descendants bailed out, with `actualDuration` near 0; checked on 19.3.1),"),
])
apply('38-phase-assessment.md', [
("  <Profiler id=\"child\" onRender={rec.onRender}>\n          <Child label=\"static\" />\n        </Profiler>","  <Profiler id=\"child\" onRender={rec.onRender}>\n          <Child label=\"static\" />\n        </Profiler>") if False else ("import { createRecorder } from './recorder';\n\ntest('memo child is skipped when parent state changes', async () => {","import '@testing-library/jest-dom/vitest';   // needed for toHaveTextContent (or assert on .textContent)\nimport { createRecorder } from './recorder';\n\ntest('memo child is skipped when parent state changes', async () => {"),
])
