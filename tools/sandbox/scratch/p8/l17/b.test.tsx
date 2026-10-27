import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode, useEffect, useState } from "react";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
it("B1", async () => {
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});
  function Late() { const [v, setV] = useState<string | null>(null); useEffect(() => { const id = setTimeout(() => setV("Ready"), 50); return () => clearTimeout(id); }, []); return <p>{v ?? "Loading"}</p>; }
  render(<Late />);
  expect(screen.queryByText("Ready")).toBeNull();
  expect(await screen.findByText("Ready")).toBeInTheDocument();
  console.log("RESULT B1 console.error calls:", spy.mock.calls.length);
  spy.mockRestore();
});
it("B2", async () => {
  const onChange = vi.fn((e: any) => e.target.value);
  const seen: string[] = [];
  render(<input aria-label="Name" value="a" onChange={(e) => { seen.push(e.target.value); onChange(e); }} />);
  await userEvent.setup().type(screen.getByLabelText("Name"), "bc");
  console.log("RESULT B2 final:", (screen.getByLabelText("Name") as HTMLInputElement).value, "calls", onChange.mock.calls.length, seen);
});
it("B3", async () => {
  const onClick = vi.fn();
  render(<button disabled onClick={onClick}>Save</button>);
  const b = screen.getByRole("button", { name: "Save" });
  await userEvent.setup().click(b);
  console.log("RESULT B3 found:", !!b, "called", onClick.mock.calls.length);
});
it("B5", () => {
  const track = vi.fn();
  function Ping() { useEffect(() => { track("view"); }, []); return null; }
  render(<StrictMode><Ping /></StrictMode>);
  console.log("RESULT B5 track calls:", track.mock.calls.length);
});
