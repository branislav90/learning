// @vitest-environment node
import "./setup-dom";
import { describe, it, expect } from "vitest";
import * as React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, Outlet, NavLink, Link, redirect, data, Await, useLoaderData, isRouteErrorResponse, useRouteError, matchRoutes, useSearchParams, href } from "react-router";
import { RouterProvider } from "react-router/dom";
import * as RR from "react-router";

describe("rr", () => {
  it("exports", () => {
    console.log("RouterProvider from react-router:", typeof (RR as any).RouterProvider, "defer:", typeof (RR as any).defer, "json:", typeof (RR as any).json, "data:", typeof data, "href:", typeof href, "createBrowserRouter:", typeof (RR as any).createBrowserRouter);
  });
  it("layout state preserved, relative NavLink, aria-current, index", async () => {
    let layoutMounts = 0;
    function Layout() {
      const [c, setC] = React.useState(0);
      React.useEffect(() => { layoutMounts++; }, []);
      return (<div><button onClick={() => setC(c + 1)}>count {c}</button>
        <nav><NavLink to="profile">Profile</NavLink><NavLink to="billing">Billing</NavLink></nav><Outlet /></div>);
    }
    const router = createMemoryRouter([{ path: "/dashboard/settings", Component: Layout, children: [
      { index: true, Component: () => <h1>Overview</h1> },
      { path: "profile", Component: () => <h1>Profile</h1> },
      { path: "billing", Component: () => <h1>Billing</h1> },
    ]}], { initialEntries: ["/dashboard/settings"] });
    render(<RouterProvider router={router} />);
    const u = userEvent.setup();
    expect(screen.getByText("Overview")).toBeTruthy();
    await u.click(screen.getByText("count 0"));
    await u.click(screen.getByText("Billing"));
    await screen.findByText("count 1");
    expect(screen.getByRole("heading").textContent).toBe("Billing");
    console.log("href", screen.getByText("Billing", {selector:"a"}).getAttribute("href"), "aria-current", screen.getByText("Billing", {selector:"a"}).getAttribute("aria-current"), "layoutMounts", layoutMounts);
  });
  it("redirect inside try/catch swallowed; thrown redirect works otherwise", async () => {
    const bad = async () => { try { throw redirect("/orders"); } catch { return { error: "failed" }; } };
    const r = await bad();
    expect(r).toEqual({ error: "failed" });
    const router = createMemoryRouter([
      { path: "/orders", Component: () => <h1>Orders</h1> },
      { path: "/o/:id", loader: async () => { throw redirect("/orders"); }, Component: () => <h1>O</h1> },
    ], { initialEntries: ["/o/1"] });
    render(<RouterProvider router={router} />);
    await screen.findByText("Orders");
    console.log("history after redirect:", router.state.location.pathname, router.state.historyAction);
  });
  it("data() 400 throw -> error boundary; ranking", async () => {
    function EB() { const e = useRouteError(); return <p>{isRouteErrorResponse(e) ? `${e.status} ${e.data}` : "other"}</p>; }
    const routes = [
      { path: "/users/:id", Component: () => <h1>user id</h1> },
      { path: "/users/new", Component: () => <h1>new</h1> },
      { path: "/bad/:id", loader: () => { throw data("Bad id", { status: 400 }); }, Component: () => <h1>x</h1>, ErrorBoundary: EB },
    ];
    console.log("match /users/new (dynamic defined first):", matchRoutes(routes, "/users/new")?.[0].route.path);
    const router = createMemoryRouter(routes, { initialEntries: ["/bad/x"] });
    render(<RouterProvider router={router} />);
    await screen.findByText("400 Bad id");
  });
  it("streaming promise + Await; params are strings", async () => {
    function P() { const d = useLoaderData() as any; return <React.Suspense fallback={<p>loading</p>}><Await resolve={d.reviews}>{(v: string) => <p>{v}</p>}</Await></React.Suspense>; }
    const router = createMemoryRouter([{ path: "/p/:id", loader: ({ params }) => ({ id: params.id, typeofId: typeof params.id, reviews: new Promise((r) => setTimeout(() => r("reviews!"), 50)) }), Component: P }], { initialEntries: ["/p/42"] });
    render(<RouterProvider router={router} />);
    await screen.findByText("reviews!");
    console.log("loaderData typeof id", (router.state.loaderData as any)["0"].typeofId);
  });
  it("href()", () => { console.log("href:", href("/users/:id", { id: "7" })); });
  it("Link from the optional param / splat", () => {
    const routes = [{ path: "/dashboard/*", Component: () => null }, { path: "/dashboard/settings", Component: () => null }, {path:"/u/:id?", Component: () => null}];
    console.log("splat rank:", matchRoutes(routes, "/dashboard/settings")?.[0].route.path, matchRoutes(routes, "/u")?.[0].route.path, matchRoutes(routes, "/u/3")?.[0].params);
  });
});
