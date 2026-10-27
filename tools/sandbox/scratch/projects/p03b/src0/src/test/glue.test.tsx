import { render, act, screen } from "@testing-library/react";
import { createMemoryRouter, Outlet, type RouteObject } from "react-router";
import { RouterProvider } from "react-router/dom";
import { it } from "vitest";
interface Mod { id: string; nav: { to: string }[]; routes: () => Promise<RouteObject[]> }
const wo: Mod = { id: "wo", nav: [{ to: "/work-orders" }], routes: async () => [{ index: true, Component: () => <p>list</p> }, { path: "new", Component: () => <p>new form</p> }] };
function ModuleBoundary({ id }: { id: string }) { return <section data-module={id}><Outlet /></section>; }
function build(mods: Mod[], initial: string) {
  return createMemoryRouter(
    [{ id: "root", path: "/", Component: () => <main><Outlet /></main>, children: [{ index: true, Component: () => <p>home</p> }, { path: "*", Component: () => <p>404</p> }] }],
    {
      initialEntries: [initial],
      async patchRoutesOnNavigation({ path, patch }) {
        const m = mods.find((m) => path === m.nav[0]!.to || path.startsWith(m.nav[0]!.to + "/"));
        if (!m) return;
        patch("root", [{ path: m.nav[0]!.to.slice(1), Component: () => <ModuleBoundary id={m.id} />, children: await m.routes() }]);
      },
    },
  );
}
it("module routes load on first visit via patchRoutesOnNavigation", async () => {
  const router = build([wo], "/");
  render(<RouterProvider router={router} />);
  await act(async () => { await router.navigate("/work-orders/new"); });
  console.log("glue ->", document.body.innerHTML);
  await act(async () => { await router.navigate("/nope"); });
  console.log("unknown ->", document.body.textContent);
});
