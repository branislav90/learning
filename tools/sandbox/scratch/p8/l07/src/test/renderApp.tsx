// src/test/renderApp.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";

export function renderApp(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false } },
  });
  const user = userEvent.setup();
  return { user, queryClient, ...render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>) };
}
