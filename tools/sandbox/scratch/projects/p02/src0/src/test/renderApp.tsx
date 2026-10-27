// src/test/renderApp.tsx
import { render } from "@testing-library/react";
import { TasksProvider } from "../state";
import { Layout } from "../components/Layout";

export function renderApp() {
  return render(
    <TasksProvider>
      <Layout />
    </TasksProvider>,
  );
}
