// src/test/rendering.test.tsx
import { Profiler } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { TasksProvider } from "../state";
import { TaskComposer } from "../components/TaskPanel/TaskComposer";
import { TaskList } from "../components/TaskPanel/TaskList";
import { INBOX_ID } from "../types";

it("typing in the composer does not commit anything inside the task list subtree", async () => {
  localStorage.clear();
  const user = userEvent.setup();
  const onRender = vi.fn();

  render(
    <TasksProvider>
      <TaskComposer projectId={INBOX_ID} />
      <Profiler id="list" onRender={onRender}>
        <TaskList projectId={INBOX_ID} filter="all" query="" />
      </Profiler>
    </TasksProvider>,
  );

  onRender.mockClear(); // ignore the mount commit
  await user.type(screen.getByLabelText(/new task/i), "abc");

  // Composer state is local; TaskList is a sibling, not a descendant of the composer.
  expect(onRender).not.toHaveBeenCalled();
});
