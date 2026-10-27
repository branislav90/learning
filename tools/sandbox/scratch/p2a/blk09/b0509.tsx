import { Profiler, type ProfilerOnRenderCallback, useState } from "react";

const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration) => {
  // phase: "mount" | "update" | "nested-update"
  console.log(id, phase, `actual=${actualDuration.toFixed(2)}ms`, `base=${baseDuration.toFixed(2)}ms`);
};

function Slow({ ms }: { ms: number }) {
  const end = performance.now() + ms;
  while (performance.now() < end) {} // demo only
  return null;
}

export function Demo() {
  const [n, setN] = useState(0);
  return (
    <Profiler id="demo" onRender={onRender}>
      <button onClick={() => setN(n + 1)}>{n}</button>
      <Slow ms={20} />
      <Slow ms={20} />
    </Profiler>
  );
}
