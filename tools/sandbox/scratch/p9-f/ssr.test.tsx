// @vitest-environment node
import { test } from "vitest";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import * as React from "react";
const h = React.createElement;
function fn(fd: FormData) {}
test("ssr", async () => {
  console.log("1 fn action:", renderToString(h("form", { action: fn }, h("button", null, "go"))));
  console.log("2 string action:", renderToString(h("form", { action: "/x", method: "post" }, h("button", null, "go"))));
  console.log("3 fn action + method:", renderToString(h("form", { action: fn, method: "post", id:"f" }, h("button", null, "go"))));
  // server reference simulation
  const ref: any = () => {};
  ref.$$FORM_ACTION = (prefix: string) => ({ name: prefix, method: "POST", action: "/_actions/abc", encType: "multipart/form-data", data: new FormData() });
  console.log("4 server-ref action:", renderToString(h("form", { action: ref }, h("input", {name:"a"}), h("button", null, "go"))));
  const ref2: any = () => {};
  ref2.$$FORM_ACTION = (prefix: string) => { const d = new FormData(); d.append(prefix + "id", "abc"); return { name: prefix, method: "POST", action: "/_actions", encType: "multipart/form-data", data: d }; };
  console.log("5 server-ref w/ hidden data:", renderToString(h("form", { action: ref2 }, h("button", null, "go"))));
  console.log("6 button formAction fn:", renderToString(h("form", null, h("button", { formAction: fn }, "go"))));
  console.log("7 button formAction fn + form action string:", renderToString(h("form", {action:"/a"}, h("button", { formAction: fn }, "go"))));
  // via renderToPipeableStream with bootstrap
  const { renderToPipeableStream } = await import("react-dom/server");
  const { PassThrough } = await import("node:stream");
  const out: string[] = [];
  await new Promise<void>((res) => {
    const pt = new PassThrough(); pt.on("data", (c) => out.push(String(c))); pt.on("end", res);
    const s = renderToPipeableStream(h("form", { action: fn }, h("button", null, "go")), { bootstrapScripts: ["/main.js"], onAllReady() { s.pipe(pt); } });
  });
  console.log("8 stream:", out.join(""));
  const out2: string[] = [];
  await new Promise<void>((res) => {
    const pt = new PassThrough(); pt.on("data", (c) => out2.push(String(c))); pt.on("end", res);
    const s = renderToPipeableStream(h("div", null, "no form"), { bootstrapScripts: ["/main.js"], onAllReady() { s.pipe(pt); } });
  });
  console.log("9 stream no form:", out2.join(""));
});
