import React from "react";
import { test } from "vitest";
import { renderToString } from "react-dom/server";
import { render } from "@testing-library/react";
test("fp", () => {
  const err: string[] = [];
  const o = console.error; console.error = (...a:any[]) => { err.push(String(a[0]).slice(0,120)+" | "+String(a[1])+" "+String(a[2])); };
  // @ts-ignore
  console.log("lower:", renderToString(<img src="a.jpg" alt="" {...{ fetchpriority: "high" }} />));
  console.log("camel:", renderToString(<img src="a.jpg" alt="" fetchPriority="high" />));
  const { container } = render(<img src="a.jpg" alt="" {...({ fetchpriority: "high" } as any)} />);
  console.log("dom lower:", container.innerHTML);
  console.error = o; console.log("errors:", err);
});
