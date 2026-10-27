import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";
test("basic", async () => {
  const router = createMemoryRouter([{ path: "/", element: <p>Hi</p> }], { initialEntries: ["/"] });
  const err = vi.spyOn(console, "error");
  const { container } = render(<RouterProvider router={router} />);
  console.log("RESULT html:", container.innerHTML, "init:", router.state.initialized, "errs", err.mock.calls.map(c => String(c[0]).slice(0, 100)));
  await new Promise(r => setTimeout(r, 200));
  console.log("RESULT html later:", container.innerHTML);
});
test("basic from react-router", async () => {
  const { RouterProvider: RP } = await import("react-router");
  const router = createMemoryRouter([{ path: "/", element: <p>Hi</p> }], { initialEntries: ["/"] });
  const { container } = render(<RP router={router} />);
  console.log("RESULT RP from react-router html:", container.innerHTML);
});
