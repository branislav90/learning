// @vitest-environment jsdom
import { it, expect, vi } from "vitest";
import { act, useId, useState } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
let flip = false;
const Good = () => <p>hi {"ada"}</p>;
const Bad = () => <p>{flip ? "client" : "server"}</p>;
async function run(App: () => JSX.Element) {
  flip = false;
  const html = renderToString(<App />);
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.append(container);
  const errors: unknown[] = [];
  const spy = vi.spyOn(console, "error").mockImplementation((...a) => { errors.push(a); });
  flip = true;
  await act(async () => {
    hydrateRoot(container, <App />, { onRecoverableError: (e) => errors.push(e) });
  });
  spy.mockRestore();
  return errors;
}
it("hydrates without errors", async () => { expect(await run(Good)).toEqual([]); });
it("detects mismatch", async () => { expect((await run(Bad)).length).toBeGreaterThan(0); });
