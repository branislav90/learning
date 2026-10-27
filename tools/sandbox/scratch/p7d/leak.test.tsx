import React, { StrictMode, useEffect, useCallback } from "react";
import { test, expect } from "vitest";
import { render } from "@testing-library/react";
let n = 0;
const sub = () => { n++; return () => { n--; }; };
const Sym = () => { useEffect(() => sub(), []); return null; };
const Asym = () => { useEffect(() => { n++; }, []); return null; };
test("strict", () => {
  n = 0; const a = render(<StrictMode><Sym /></StrictMode>); const afterSym = n; a.unmount(); const un = n;
  n = 0; const b = render(<StrictMode><Asym /></StrictMode>); const afterAsym = n;
  console.log({ afterSym, un, afterAsym });
});
test("ref", () => {
  const log: string[] = [];
  const A = () => <div ref={useCallback((el: HTMLElement | null) => { log.push("A:" + (el ? "el" : "null")); }, [])} />;
  const B = () => <div ref={useCallback((el: HTMLElement | null) => { log.push("B:" + (el ? "el" : "null")); return () => log.push("B:cleanup"); }, [])} />;
  const a = render(<A />); a.unmount(); const b = render(<B />); b.unmount();
  console.log(log.join(","));
  const log2 = log.splice(0); const c = render(<StrictMode><A/></StrictMode>); console.log("strict A:", log.join(","));
});
