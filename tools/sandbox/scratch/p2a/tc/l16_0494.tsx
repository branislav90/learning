import { Profiler, useDeferredValue, useLayoutEffect, useState, type ProfilerOnRenderCallback } from "react";

const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
  console.info("[commit]", id, phase, actualDuration.toFixed(1) + "ms");
};

function Probe({ label, value }: { label: string; value: string }) {
  console.info("[render]", label, JSON.stringify(value));     // render phase: may fire without commit
  useLayoutEffect(() => {
    console.info("[layout]", label, JSON.stringify(value));    // commit phase: one per commit
  });
  return null;
}

export function Instrumented() {
  const [text, setText] = useState("");
  const deferred = useDeferredValue(text);
  return (
    <Profiler id="demo" onRender={onRender}>
      <input value={text} onChange={(e) => setText(e.target.value)} aria-label="Type here" />
      <Probe label="urgent" value={text} />
      <Probe label="deferred" value={deferred} />
    </Profiler>
  );
}
