// src/main.tsx
import { createRoot } from "react-dom/client";
import { loadConfig, ConfigError } from "@/shared/config/load";
import { App } from "./app/App";
import { ConfigProvider } from "@/shared/config/ConfigContext";
import { FatalError } from "./app/FatalError";

const container = document.getElementById("root")!;
const root = createRoot(container);

loadConfig()
  .then((config) => {
    root.render(
      <ConfigProvider value={config}>
        <App />
      </ConfigProvider>,
    );
  })
  .catch((err: unknown) => {
    // Report if monitoring is reachable without config (see lesson 05), then show a safe UI.
    root.render(<FatalError error={err instanceof ConfigError ? err : new ConfigError("Startup failed", err)} />);
  });
