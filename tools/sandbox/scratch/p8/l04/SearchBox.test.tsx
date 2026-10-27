// SearchBox.test.tsx
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { SearchBox, type Hit } from "./SearchBox";
import { deferred } from "./test/deferred";

beforeEach(() => {
  // RTL's asyncWrapper only auto-advances fake timers when a global `jest` exists
  vi.stubGlobal("jest", { advanceTimersByTime: vi.advanceTimersByTime.bind(vi) });
  vi.useFakeTimers();
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

function setup(search = vi.fn<(q: string, s: AbortSignal) => Promise<Hit[]>>()) {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });
  render(<SearchBox search={search} debounceMs={300} />);
  return { user, search, input: screen.getByLabelText("Search") };
}

test("debounces: one request with the final text after a pause", async () => {
  const { user, search, input } = setup(vi.fn().mockResolvedValue([{ id: "1", title: "React" }]));

  await user.type(input, "rea");
  await act(async () => { await vi.advanceTimersByTimeAsync(299); });
  expect(search).not.toHaveBeenCalled();

  await act(async () => { await vi.advanceTimersByTimeAsync(1); });
  expect(search).toHaveBeenCalledTimes(1);
  expect(search).toHaveBeenCalledWith("rea", expect.any(AbortSignal));
  expect(within(screen.getByRole("list", { name: "Results" })).getByText("React")).toBeInTheDocument();
});

test("ignores a stale response that arrives after a newer one", async () => {
  const first = deferred<Hit[]>();
  const second = deferred<Hit[]>();
  const search = vi.fn()
    .mockReturnValueOnce(first.promise)
    .mockReturnValueOnce(second.promise);
  const { user, input } = setup(search);

  await user.type(input, "re");
  await act(async () => { await vi.advanceTimersByTimeAsync(300); });  // request #1 for "re"

  await user.type(input, "a");
  await act(async () => { await vi.advanceTimersByTimeAsync(300); });  // request #2 for "rea"

  await act(async () => { second.resolve([{ id: "2", title: "React (new)" }]); });
  await act(async () => { first.resolve([{ id: "1", title: "Redux (stale)" }]); });

  console.log("RESULT calls", JSON.stringify(search.mock.calls.map(c=>c[0])));
  expect(screen.getByText("React (new)")).toBeInTheDocument();
  expect(screen.queryByText("Redux (stale)")).not.toBeInTheDocument();
});
