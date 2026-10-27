import { test, expect } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { counts, reset } from "./track.js";
import { App as Plain } from "./app.jsx";
import { App as Compiled } from "./app.compiled.jsx";

for (const [name, App] of [["plain", Plain], ["compiled", Compiled]]) {
  test(name, async () => {
    cleanup(); reset();
    const user = userEvent.setup();
    render(<App />);
    console.log(name, "mount", JSON.stringify(counts)); reset();
    await user.click(screen.getByRole("button"));
    console.log(name, "click counter", JSON.stringify(counts)); reset();
    await user.click(screen.getByText("t2"));
    console.log(name, "toggle todo 2", JSON.stringify(counts)); reset();
    expect(screen.getByText("t2 (done)")).toBeTruthy();
  });
}
