from apply import apply
apply('38-phase-assessment.md', [
("""  function Parent() {
    const [n, setN] = useState(0);
    return (
      <>
        <button onClick={() => setN(n + 1)}>{n}</button>
        <Profiler id="child" onRender={rec.onRender}>
          <Child label="static" />
        </Profiler>
      </>
    );
  }
""","""  // The Profiler itself must sit behind a memo boundary. If <Profiler> is rendered directly by the
  // re-rendering Parent, React re-renders the Profiler fiber and calls onRender on every update
  // (with actualDuration ~ 0) even though Child bails out.
  const ProfiledChild = memo(function ProfiledChild() {
    return (
      <Profiler id="child" onRender={rec.onRender}>
        <Child label="static" />
      </Profiler>
    );
  });

  function Parent() {
    const [n, setN] = useState(0);
    return (
      <>
        <button onClick={() => setN(n + 1)}>{n}</button>
        <ProfiledChild />
      </>
    );
  }
"""),
("What each proves: (a) the child's function body did not run for that update (render-phase evidence); (b) no commit touched the profiled subtree (commit evidence, documented to fire when a component in the tree commits an update). What they cannot prove:",
 "What each proves: (a) the child's function body did not run for that update (render-phase evidence); (b) no commit touched the profiled subtree (`onRender` is documented to fire when components within the profiled tree update). Executed on react 19.3.1 + Testing Library 16.3.3 + Vitest 3 with `@testing-library/jest-dom/vitest` imported: this version passes; the earlier form with `<Profiler>` placed directly inside `Parent` **fails** assertion (b) (`onRender` fired once with `actualDuration` about 0.01 ms because React re-renders the Profiler fiber itself, `updateProfiler` sets its `Update` flag unconditionally), which is itself a worthwhile finding to report. What they cannot prove:"),
])
