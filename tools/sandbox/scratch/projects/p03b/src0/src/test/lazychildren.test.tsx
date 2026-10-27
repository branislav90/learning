import { render, screen, act } from "@testing-library/react";
import { createMemoryRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
import { it, expect, vi } from "vitest";

it("lazy returning children", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  const err = vi.spyOn(console, "error").mockImplementation(() => {});
  const router = createMemoryRouter([
    { path: "/", Component: () => <p>home</p> },
    { path: "wo", lazy: async () => ({ Component: () => <div>shell<Outlet /></div>, children: [{ index: true, Component: () => <p>list</p> }, { path: "new", Component: () => <p>new form</p> }] } as never) },
  ], { initialEntries: ["/wo/new"] });
  render(<RouterProvider router={router} />);
  await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
  console.log("body:", document.body.textContent, "| warns:", warn.mock.calls.map((c) => String(c[0]).slice(0, 140)), "| errors:", err.mock.calls.map((c) => String(c[0]).slice(0, 100)));
});

it("patchRoutesOnNavigation lazily adds module routes", async () => {
  const router = createMemoryRouter([
    { path: "/", Component: () => <p>home</p> },
  ], {
    initialEntries: ["/wo/new"],
    async patchRoutesOnNavigation({ path, patch }) {
      if (path.startsWith("/wo")) {
        patch(null, [{ path: "wo", Component: () => <div>shell<Outlet /></div>, children: [{ index: true, Component: () => <p>list</p> }, { path: "new", Component: () => <p>new form</p> }] }]);
      }
    },
  });
  render(<RouterProvider router={router} />);
  await act(async () => { await new Promise((r) => setTimeout(r, 50)); });
  console.log("patch body:", document.body.textContent);
});
