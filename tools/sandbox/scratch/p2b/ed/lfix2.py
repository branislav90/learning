from apply import apply
apply('20-commit-and-dom-mutation.md', [
("`completeWork` determines whether the host node needs an update (props changed). Older versions","`completeWork` determines whether the host node needs an update. In React 19 that test is only whether the props *object* is the same as last time (`oldProps === newProps`, `updateHostComponent` in `ReactFiberCompleteWork.js`), so a host element rendered by a re-rendered parent is flagged `Update` even if no individual prop changed (executed: the stored-props record of an unchanged `<article>` was replaced after a parent re-render, while no DOM mutation occurred). Older versions"),
])
apply('31-reading-react-source.md', [
("For the host `<p>` and `<button>` elements, compare props; if no differences, no update flag.","For the host `<p>` and `<button>` elements, React 19 compares only the props *object identity* here (new object, so they are flagged `Update`; the per-property diff runs later in `commitUpdate` and finds nothing to write; see [32 §3.3](./32-scenario-a-parent-rerender.md))."),
])
apply('34-scenario-c-list-reorder.md', [
("the returned `li` trees reconcile with no differences → no flags. Commit is unchanged: 3 moves, no text writes.","the returned `li` trees reconcile against the existing fibers with equal values (in React 19 their host fibers still get an `Update` flag because the props objects are new, but `commitUpdate` finds nothing to write). Commit is unchanged: 3 moves, no text writes."),
])
