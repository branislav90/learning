const { JSDOM } = require("jsdom");
const dom = new JSDOM("<div id=root></div>");
globalThis.window = dom.window; globalThis.document = dom.window.document;
const React = require("react"); const { createRoot } = require("react-dom/client");
function P({ p }) { const u = React.use(p); return React.createElement("h2", null, u.name); }
const root = createRoot(document.getElementById("root"));
const p = Promise.resolve({ name: "Bob" });
const t0 = Date.now();
root.render(React.createElement(React.Suspense, { fallback: "loading" }, React.createElement(P, { p })));
const iv = setInterval(() => { if (document.getElementById("root").innerHTML.includes("Bob")) { console.log("revealed at", Date.now() - t0, "ms"); process.exit(0); } }, 10);
setTimeout(() => { console.log("never"); process.exit(0); }, 5000);
