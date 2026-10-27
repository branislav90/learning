import React, { memo, createContext, useContext, useState, useDeferredValue, useEffect } from "react";
import { test } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

test("B1", async () => {
  let c = 0;
  const Row = memo(function Row({ label, style }: { label: string; style: React.CSSProperties }) { c++; return <li style={style}>{label}</li>; });
  const RED = { color: "red" };
  const mk = (const_: boolean) => function List({ labels }: { labels: string[] }) {
    const [n, setN] = useState(0);
    return <><button onClick={() => setN(n + 1)}>{n}</button><ul>{labels.map(l => <Row key={l} label={l} style={const_ ? RED : { color: "red" }} />)}</ul></>;
  };
  const labels = Array.from({ length: 100 }, (_, i) => "l" + i);
  for (const k of [false, true]) {
    c = 0; const L = mk(k); const r = render(<L labels={labels} />);
    for (let i = 0; i < 3; i++) await userEvent.click(screen.getByRole("button"));
    console.log("B1 const=" + k, c); r.unmount();
  }
});
test("B2", async () => {
  for (const useMemoWrap of [true, false]) {
    let c = 0;
    const Ctx = createContext({ count: 0, label: "x" });
    function Provider({ children }: { children: React.ReactNode }) {
      const [count, setCount] = useState(0);
      return <Ctx.Provider value={{ count, label: "x" }}><button onClick={() => setCount(x => x + 1)}>+</button>{children}</Ctx.Provider>;
    }
    const Inner = function Label() { const { label } = useContext(Ctx); c++; return <span>{label}</span>; };
    const Label = useMemoWrap ? memo(Inner) : Inner;
    const r = render(<Provider><Label /></Provider>);
    await userEvent.click(screen.getByRole("button")); await userEvent.click(screen.getByRole("button"));
    console.log("B2 memo=" + useMemoWrap, c); r.unmount();
  }
});
test("B3", async () => {
  const log: string[] = [];
  const Results = memo(function Results({ query }: { query: string }) { log.push("R:" + query); return <ul />; });
  function SearchPage() {
    const [q, setQ] = useState("a"); const d = useDeferredValue(q);
    log.push("S:" + q + "/" + d);
    return <><input value={q} onChange={e => setQ(e.target.value)} /><Results query={d} /></>;
  }
  render(<SearchPage />); log.length = 0;
  await userEvent.type(screen.getByRole("textbox"), "b");
  console.log("B3", log.join(" "));
});
test("B4", async () => {
  let e = 0; const Expensive = () => { e++; return null; };
  function App() { const [c, setC] = useState(0); return <><button onClick={() => setC(c + 1)}>{c}</button><Expensive /></>; }
  function Counter({ children }: any) { const [c, setC] = useState(0); return <><button onClick={() => setC(c + 1)}>{c}</button>{children}</>; }
  function App2() { return <Counter><Expensive /></Counter>; }
  function Counter3() { const [c, setC] = useState(0); return <button onClick={() => setC(c + 1)}>{c}</button>; }
  function App3() { return <><Counter3 /><Expensive /></>; }
  for (const [n, A] of [["V1", App], ["V2", App2], ["V3", App3]] as const) {
    e = 0; const r = render(<A />);
    for (let i = 0; i < 3; i++) await userEvent.click(screen.getByRole("button"));
    console.log("B4", n, e); r.unmount();
  }
});
test("B7", async () => {
  vi.useFakeTimers(); const spy = vi.spyOn(globalThis, "setInterval"); const clr = vi.spyOn(globalThis, "clearInterval");
  function Ticker({ count }: { count: number }) { useEffect(() => { setInterval(() => {}, 1000); }, [count]); return <span>{count}</span>; }
  const r = render(<Ticker count={0} />); r.rerender(<Ticker count={1} />); r.rerender(<Ticker count={2} />);
  r.unmount(); console.log("B7 intervals", spy.mock.calls.length, "cleared", clr.mock.calls.length, "timers", vi.getTimerCount());
  vi.useRealTimers();
});
