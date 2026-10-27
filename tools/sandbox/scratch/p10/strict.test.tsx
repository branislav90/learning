// @vitest-environment jsdom
import React, { StrictMode, useEffect, useRef, useId } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { test, expect } from "vitest";
test("strict first render", () => {
  const log: string[] = [];
  function C({p}:{p:string}) { const first = useRef(true); useEffect(()=>{ if(first.current){first.current=false; log.push("skip"); return;} log.push("focus"); },[p]); return null; }
  render(<StrictMode><C p="/"/></StrictMode>);
  console.log("strict", log);
  log.length=0; render(<C p="/"/>); console.log("prod", log);
});
test("desc", () => {
  function Field({label,hint,error}:{label:string;hint:string;error:string}){ const id=useId(); return <div><label htmlFor={id}>{label}</label><input id={id} aria-invalid="true" aria-describedby={`${id}-h ${id}-e`}/><p id={`${id}-h`}>{hint}</p><p id={`${id}-e`}>{error}</p></div>; }
  render(<Field label="Email" hint="We never share it" error="Enter a valid email"/>);
  expect(screen.getByLabelText("Email")).toHaveAccessibleDescription("We never share it Enter a valid email");
  expect(screen.getByLabelText("Email")).toBeInvalid();
  const d = document.createElement("dialog"); console.log("showModal" in d);
});
