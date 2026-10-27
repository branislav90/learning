// src/test/renderRoute.tsx
import { render } from "@testing-library/react";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { createRoutes } from "../app/routes";
import { createFleetApiFromHttp } from "../app/createFleetApi";
import { createFakeBackend, type FakeBackendOptions } from "../mocks/fakeBackend";
import { SettingsProvider } from "../features/settings";

export function renderRoute(initialEntry: string, backend: FakeBackendOptions = { latencyMs: 0 }) {
  const api = createFleetApiFromHttp(createFakeBackend(backend));
  const router = createMemoryRouter(createRoutes(api), { initialEntries: [initialEntry] });
  const utils = render(
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>,
  );
  return { router, api, ...utils };
}
