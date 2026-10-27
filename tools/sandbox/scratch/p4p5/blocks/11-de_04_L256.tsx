// app/main.tsx  — the composition root
import { createRoot } from "react-dom/client";
import { ServicesProvider } from "../services/ServicesContext";
import { App } from "./App";
import { createVendorAnalytics } from "../infrastructure/vendor-analytics";

const services = {
  clock: { now: () => new Date() },
  analytics: createVendorAnalytics({ writeKey: import.meta.env.VITE_ANALYTICS_KEY }),   // bundler-specific env access (Vite shown)
};

createRoot(document.getElementById("root")!).render(
  <ServicesProvider value={services}><App /></ServicesProvider>,
);
export {};
