import { it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe, configureAxe } from "./axe/node_modules/vitest-axe";
it("contrast in jsdom", async () => {
  const { container } = render(<main><p style={{ color: "#ccc", background: "#fff" }}>low contrast</p></main>);
  const r = await axe(container);
  console.log("RESULT violations:", r.violations.map(v => v.id), "incomplete:", r.incomplete.map(v => v.id), "axe", (r as any).testEngine?.version);
});
it("page-level rules on component fragment", async () => {
  const { container } = render(<div><h1>Hi</h1></div>);
  const r = await axe(container);
  console.log("RESULT fragment violations:", r.violations.map(v => v.id));
  const r2 = await axe(document.body);
  console.log("RESULT body violations:", r2.violations.map(v => v.id));
  const r3 = await configureAxe({ rules: { region: { enabled: false } } })(document.body);
  console.log("RESULT body w/o region:", r3.violations.map(v => v.id));
});
