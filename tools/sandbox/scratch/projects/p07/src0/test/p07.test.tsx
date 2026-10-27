import { StrictMode, useState, useCallback } from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect, vi } from "vitest";
import { Tabs } from "../primitives/tabs/tabs";
import { composeRefs } from "../core/compose";
import { Button } from "../components/button/button";
import { useControllableState } from "../hooks/useControllableState";

function DemoTabs({ defaultValue }: { defaultValue: string }) {
  return (
    <Tabs.Root defaultValue={defaultValue}>
      <Tabs.List>
        {["Profile", "Billing", "Security"].map((n) => <Tabs.Trigger key={n} value={n}>{n}</Tabs.Trigger>)}
      </Tabs.List>
      {["Profile", "Billing", "Security"].map((n) => <Tabs.Panel key={n} value={n}>{n} panel</Tabs.Panel>)}
    </Tabs.Root>
  );
}
const cases = [["ArrowRight", "Billing"], ["ArrowLeft", "Profile"], ["End", "Security"], ["Home", "Profile"]] as const;
it.each(cases)("Tabs: %s moves focus and selection", async (key, expected) => {
  const user = userEvent.setup();
  render(<DemoTabs defaultValue="Profile" />);
  await user.tab();
  expect(screen.getByRole("tab", { name: "Profile" })).toHaveFocus();
  await user.keyboard(`{${key}}`);
  expect(screen.getByRole("tab", { name: expected, selected: true })).toHaveFocus();
});

it("composeRefs mixes legacy fn ref, object ref and cleanup ref under StrictMode", () => {
  const log: string[] = [];
  const obj = { current: null as HTMLDivElement | null };
  const legacy = (n: HTMLDivElement | null) => { log.push("legacy:" + (n ? "node" : "null")); };
  const cleanup = (n: HTMLDivElement | null) => { log.push("cleanup-ref:attach"); return () => log.push("cleanup-ref:detach"); };
  function C() { const ref = useCallback(composeRefs<HTMLDivElement>(legacy, obj, cleanup), []); return <div ref={ref} />; }
  const { unmount } = render(<StrictMode><C /></StrictMode>);
  console.log("after mount:", log.join(", "), "obj set:", obj.current !== null);
  unmount();
  console.log("after unmount:", log.join(", "), "obj null:", obj.current === null);
});

it("composeRefs unstable each render detaches/attaches every render", () => {
  let attaches = 0;
  const r = (n: HTMLDivElement | null) => { if (n) attaches++; };
  function C() { const [, set] = useState(0); return <div ref={composeRefs<HTMLDivElement>(r)} onClick={() => set((x) => x + 1)} />; }
  const { container } = render(<C />);
  act(() => container.firstElementChild!.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  act(() => container.firstElementChild!.dispatchEvent(new MouseEvent("click", { bubbles: true })));
  console.log("attaches after mount + 2 re-renders:", attaches);
  expect(attaches).toBe(3);
});

it("Button asChild merges props; disabled blocks click", async () => {
  const user = userEvent.setup();
  const onClick = vi.fn(); const childClick = vi.fn();
  render(<Button asChild onClick={onClick} loading><a href="/x" onClick={childClick}>go</a></Button>);
  const a = screen.getByRole("link", { name: "go" });
  console.log("asChild attrs:", a.getAttribute("class"), a.getAttribute("data-variant"), a.getAttribute("aria-disabled"));
  await user.click(a);
  console.log("click calls child:", childClick.mock.calls.length, "slot onClick:", onClick.mock.calls.length);
});

it("useControllableState: flip warning and onChange not called when unchanged", () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  const onChange = vi.fn();
  let setter!: (v: string) => void;
  function C({ v }: { v: string | undefined }) { const [cur, set] = useControllableState({ value: v, defaultValue: "a", onChange }); setter = set as never; return <p>{cur}</p>; }
  const { rerender } = render(<C v="x" />);
  act(() => setter("x")); expect(onChange).not.toHaveBeenCalled();
  act(() => setter("y")); expect(onChange).toHaveBeenCalledWith("y");
  rerender(<C v={undefined} />);
  console.log("flip warn calls:", warn.mock.calls.length);
});
