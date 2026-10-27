const { JSDOM } = require("jsdom");
const dom = new JSDOM("<div id=root></div>");
globalThis.window = dom.window; globalThis.document = dom.window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = require("react"); const { createRoot } = require("react-dom/client");
function P({ p }) { const u = React.use(p); return React.createElement("h2", null, u.name); }
const root = createRoot(document.getElementById("root"));
const p = Promise.resolve({ name: "Bob" });
const t0 = Date.now();
const mode = process.argv[2];
(async () => {
  if (mode === "sync") React.act(() => { root.render(React.createElement(React.Suspense, { fallback: "loading" }, React.createElement(P, { p }))); });
  else await React.act(async () => { root.render(React.createElement(React.Suspense, { fallback: "loading" }, React.createElement(P, { p }))); });
  console.log("after act:", document.getElementById("root").innerHTML, Date.now() - t0);
  globalThis.IS_REACT_ACT_ENVIRONMENT = false;
  const iv = setInterval(() => { if (document.getElementById("root").innerHTML.includes("Bob")) { console.log("revealed at", Date.now() - t0, "ms"); process.exit(0); } }, 10);
  setTimeout(() => { console.log("never"); process.exit(0); }, 3000);
})();
