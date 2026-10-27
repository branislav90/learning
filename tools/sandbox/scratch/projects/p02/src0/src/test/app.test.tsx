// src/test/app.test.tsx
import { beforeEach, describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderApp } from "./renderApp";

beforeEach(() => localStorage.clear());

describe("Taskboard", () => {
  it("adds a task, completes it, and persists across a remount", async () => {
    const user = userEvent.setup();
    const first = renderApp();

    await user.type(screen.getByLabelText(/new task/i), "Write tests");
    await user.click(screen.getByRole("button", { name: /^add$/i }));
    await user.click(screen.getByRole("checkbox", { name: /complete write tests/i }));

    first.unmount();
    renderApp();

    expect(screen.getByRole("checkbox", { name: /complete write tests/i })).toBeChecked();
  });

  it("falls back to Inbox when the selected project is deleted", async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole("button", { name: /^work$/i }));
    await user.click(screen.getByRole("button", { name: /delete project work/i }));
    expect(screen.getByRole("heading", { name: /inbox/i })).toBeInTheDocument();
  });

  it("only one task can be in edit mode at a time", async () => {
    const user = userEvent.setup();
    renderApp();
    const [first, second] = screen.getAllByRole("button", { name: /^edit$/i });
    await user.click(first!);
    await user.click(second!);
    expect(screen.getAllByRole("textbox", { name: /task title/i })).toHaveLength(1);
  });

  it("recovers from corrupted storage", () => {
    localStorage.setItem("taskboard:v1", "{not json");
    renderApp();
    expect(screen.getByRole("list", { name: /tasks/i })).toBeInTheDocument();
  });
});
