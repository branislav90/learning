// apps/web/src/shell/build-router.tsx
import { createBrowserRouter, type RouteObject } from 'react-router';
import modules from './modules';             // array of imported default exports

export function buildRoutes(can: (c: string) => boolean, flag: (f: string) => boolean): RouteObject[] {
  return modules
    .filter((m) => m.nav.every((n) => (!n.requires || can(n.requires)) && (!n.flag || flag(n.flag))))
    .map((m) => ({
      path: m.nav[0]!.to.slice(1),
      // React Router lazy route: module code is fetched only on first visit
      lazy: async () => {
        const children = await m.routes();
        return { Component: () => <ModuleErrorBoundary id={m.id}><Outlet /></ModuleErrorBoundary>, children } as never;
      },
    }));
}
