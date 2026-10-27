import { test } from "vitest";
import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
test("double enter with disabled-on-pending button", async () => {
  let n = 0;
  function Btn() { const { pending } = useFormStatus(); return <button disabled={pending}>go</button>; }
  function F() { return <form action={async () => { n++; await sleep(100); }}><input name="q" aria-label="q" /><Btn /></form>; }
  render(<F />);
  const u = userEvent.setup();
  await u.click(screen.getByLabelText("q"));
  await u.keyboard("{Enter}{Enter}{Enter}");
  await act(async () => { await sleep(400); });
  console.log("Enter x3, disabled-on-pending button: invocations =", n);
});
test("double enter with NO submit button in form (pending only shown elsewhere)", async () => {
  let n = 0;
  function F() { return <form action={async () => { n++; await sleep(100); }}><input name="q" aria-label="q2" /></form>; }
  render(<F />);
  const u = userEvent.setup();
  await u.click(screen.getByLabelText("q2"));
  await u.keyboard("{Enter}{Enter}{Enter}");
  await act(async () => { await sleep(400); });
  console.log("Enter x3, no button: invocations =", n);
});
