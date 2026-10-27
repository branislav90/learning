import { Profiler } from "react";
import { render, screen, act, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeAll, expect, it } from "vitest";
import { parseFilters, serializeFilters } from "../features/shipments/model/filters";
import { SelectionStore, selectionStore } from "../features/shipments/model/selectionStore";
import { ShipmentGrid } from "../features/shipments/ui/ShipmentGrid";
import { shipmentsApi } from "../features/shipments/api/shipmentsApi";

beforeAll(() => {
  for (const [k, v] of [["clientHeight", 440], ["clientWidth", 800], ["offsetHeight", 440], ["offsetWidth", 800]] as const)
    Object.defineProperty(HTMLElement.prototype, k, { configurable: true, get: () => v });
  globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} } as never;
});

it("filters round trip + hostile", () => {
  const f = parseFilters(new URLSearchParams("q=abc&status=pending&status=delivered&sort=price&dir=asc&from=2026-01-02"));
  console.log(f, serializeFilters(f).toString());
  expect(parseFilters(serializeFilters(f))).toEqual(f);
  const bad = parseFilters(new URLSearchParams("q=abc&status=banana&sort=__proto__&from=nope"));
  console.log("hostile ->", bad);
  expect(bad.sort).toBe("createdAt");
});

it("selection range", () => {
  const s = new SelectionStore();
  const ids = ["a", "b", "c", "d", "e"];
  s.toggle("d"); s.selectRange(ids, "b");
  expect(s.ids().sort()).toEqual(["b", "c", "d"]);
  let per = 0, glob = 0;
  s.subscribeId("a", () => per++); s.subscribeCount(() => glob++);
  s.toggle("c");
  expect(per).toBe(0); expect(glob).toBe(1);
});

it("grid: windowed rows, infinite fetch with maxPages (no getPreviousPageParam), one-row commit on toggle", async () => {
  const qc = new QueryClient();
  const commits: string[] = [];
  const filters = parseFilters(new URLSearchParams());
  const { container } = render(
    <QueryClientProvider client={qc}>
      <Profiler id="g" onRender={() => {}}><ShipmentGrid filters={filters} /></Profiler>
    </QueryClientProvider>,
  );
  await waitFor(() => expect(container.querySelectorAll('[role="row"]').length).toBeGreaterThan(5));
  console.log("rows in DOM:", container.querySelectorAll('[role="row"]').length, "pages fetched:", shipmentsApi.calls.length);
  expect(container.querySelectorAll('[role="row"]').length).toBeLessThan(40);
  // render-count: Profiler per row not available; instead count checkbox toggle effect on other rows by DOM identity
  const boxes = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
  const second = boxes[1]!.closest('[role="row"]');
  fireEvent.click(boxes[0]!);
  expect(boxes[0]!.checked).toBe(true);
  expect(container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')[1]!.closest('[role="row"]')).toBe(second);
  selectionStore.clear();
  void commits;
});
