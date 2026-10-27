import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, Outlet, useRouteError, useRevalidator, useLoaderData } from "react-router";
import { RouterProvider } from "react-router/dom";
import { expect, it, vi } from "vitest";

it("interrupted navigation aborts the first loader's signal", async () => {
  const signals: AbortSignal[] = [];
  const router = createMemoryRouter([
    { path: "/", Component: () => <p>home</p> },
    { path: "/a", Component: () => <p>A</p>, loader: ({ request }) => new Promise((r) => { signals.push(request.signal); setTimeout(() => r("a"), 50); }) },
    { path: "/b", Component: () => <p>B</p>, loader: () => "b" },
  ]);
  render(<RouterProvider router={router} />);
  await act(async () => { void router.navigate("/a"); });
  await act(async () => { await router.navigate("/b"); });
  console.log("first loader signal aborted after interrupt:", signals[0]?.aborted);
  expect(signals[0]?.aborted).toBe(true);
});

it("parent and child loaders run in parallel", async () => {
  const starts: Record<string, number> = {};
  const t0 = Date.now();
  const router = createMemoryRouter([
    { path: "/", Component: () => <p>home</p> },
    { path: "/p", Component: () => <Outlet />, loader: () => new Promise((r) => { starts.parent = Date.now() - t0; setTimeout(() => r(1), 100); }),
      children: [{ path: "c", Component: () => <p>child</p>, loader: () => new Promise((r) => { starts.child = Date.now() - t0; setTimeout(() => r(1), 100); }) }] },
  ]);
  render(<RouterProvider router={router} />);
  await act(async () => { await router.navigate("/p/c"); });
  console.log("loader starts (ms):", starts);
  expect(Math.abs(starts.child! - starts.parent!)).toBeLessThan(30);
});

it("revalidate() re-runs a failed route's loader?", async () => {
  let fail = true; let calls = 0;
  function Boundary() { const e = useRouteError() as Error; const rv = useRevalidator(); return <div><p>err {e.message}</p><button onClick={() => rv.revalidate()}>retry</button></div>; }
  function Page() { return <p>ok {String(useLoaderData())}</p>; }
  const router = createMemoryRouter([{ path: "/", Component: Page, ErrorBoundary: Boundary, loader: () => { calls++; if (fail) throw new Error("boom"); return "data"; } }]);
  render(<RouterProvider router={router} />);
  expect(await screen.findByText(/err boom/)).toBeInTheDocument();
  fail = false;
  await userEvent.click(screen.getByText("retry"));
  const ok = await screen.findByText(/ok data/).then(() => true, () => false);
  console.log("revalidate recovers failed route:", ok, "loader calls:", calls);
});
