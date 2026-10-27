import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TasksProvider } from "./state";
import { Layout } from "./components/Layout";
import "./styles.css";

const container = document.getElementById("root");
if (container === null) throw new Error("Missing #root element");

createRoot(container).render(
  <StrictMode>
    <TasksProvider>
      <Layout />
    </TasksProvider>
  </StrictMode>,
);
