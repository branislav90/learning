import React from "react";
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
const log: string[] = [];
function C() {
  const [s, setS] = useState("idle");
  log.push("render:" + s);
  async function onClick() {
    setS("working");
    log.push("after setState sync");
    queueMicrotask(() => log.push("microtask queued in handler"));
    await Promise.resolve();
    log.push("after microtask await");
    await new Promise(r => setTimeout(r, 0));
    log.push("after macrotask await");
  }
  return <button onClick={onClick}>{s}</button>;
}
test("flush", async () => {
  render(<C />);
  await userEvent.click(screen.getByRole("button"));
  await new Promise(r => setTimeout(r, 20));
  console.log(log.join("\n"));
});
