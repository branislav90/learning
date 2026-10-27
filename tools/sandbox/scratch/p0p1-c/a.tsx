import React, { useRef, useReducer, createContext } from "react";
const xs = [1, undefined, 3];
const a: number[] = xs.filter(Boolean); // expect error
const b: number[] = xs.filter(x => x !== undefined); // ok 5.5
function f(items: (string|undefined)[]) {
  let first = items[0];
  if (first === undefined) return;
  const g = () => first.length; // 5.4: ok only if no later assignment
  return g;
}
function f2(items: (string|undefined)[]) {
  let first = items[0];
  if (first === undefined) return;
  const g = () => first.length;
  first = "x";
  return g;
}
const r = useRef(); // error in 19
const r2 = useRef<number>(0); r2.current = 3;
const C = createContext<number>(1);
const el = <C value={2}>x</C>;
const el2 = <C.Provider value={2}>x</C.Provider>;
const e: React.ReactElement = <div/>; const p: unknown = e.props;
const j: React.JSX.Element = <div/>;
const k: JSX.Element = <div/>;
