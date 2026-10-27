// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom"; // ⚠ v7 path; in v6 it is "react-router-dom"
import { createRoutes } from "./app/routes";
import { createFleetApi } from "./app/createFleetApi";
import { SettingsProvider } from "./features/settings";

const api = createFleetApi(); // composition root: picks fake or real HttpClient from config
const router = createBrowserRouter(createRoutes(api));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>
  </StrictMode>,
);
