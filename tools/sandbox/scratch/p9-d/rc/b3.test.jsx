import { test } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { counts, reset } from "./track.js";
import * as P from "./b3.jsx";
import * as C from "./b3.compiled.jsx";
for (const [name, M] of [["plain", P], ["compiled", C]]) {
  test(name + " B3", async () => {
    cleanup(); reset(); const save = () => {}; const user = userEvent.setup();
    render(<M.Parent save={save} />); reset();
    await user.click(screen.getByText("inc"));
    console.log(name, "B3 parent rerender, child renders:", JSON.stringify(counts));
  });
  test(name + " memo rows", async () => {
    cleanup(); reset(); const user = userEvent.setup();
    render(<M.App2 />); reset();
    await user.click(screen.getByText("t2"));
    console.log(name, "memo(Row) toggle one:", JSON.stringify(counts));
  });
}
