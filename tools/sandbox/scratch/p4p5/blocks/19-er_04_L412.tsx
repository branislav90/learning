// app/main.tsx
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!, {
  onCaughtError(error, info)      { captureError(error, { source: "boundary", componentStack: info.componentStack }); },
  onUncaughtError(error, info)    { captureError(error, { source: "uncaught", componentStack: info.componentStack, fatal: true }); },
  onRecoverableError(error, info) { captureError(error, { source: "recoverable", componentStack: info.componentStack, level: "warning" }); },
}).render(<App />);
export {};
