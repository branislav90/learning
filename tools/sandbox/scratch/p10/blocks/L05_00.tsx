// src/main.tsx
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { reporter } from "@/shared/monitoring/reporter";

const root = createRoot(document.getElementById("root")!, {
  onCaughtError(error, info) {
    reporter.capture(error, { source: "react.caught", componentStack: info.componentStack });
  },
  onUncaughtError(error, info) {
    reporter.capture(error, { source: "react.uncaught", componentStack: info.componentStack, fatal: true });
  },
  onRecoverableError(error, info) {
    reporter.capture(error, { source: "react.recoverable", componentStack: info.componentStack, level: "warning" });
  },
});

root.render(<App />);
