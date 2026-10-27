const { JSDOM } = require("jsdom");
const dom = new JSDOM("<div id=root></div>");
globalThis.window = dom.window; globalThis.document = dom.window.document;
const React = require("react"); const { createRoot } = require("react-dom/client");
function P({ p }) { const u = React.use(p); return React.createElement("h2", null, u.name); }
const root = createRoot(document.getElementById("root"));
const p = new Promise(r => setTimeout(() => r({ name: "Late" }), 50));
root.render(React.createElement(React.Suspense, { fallback: "loading" }, React.createElement(P, { p })));
for (const t of [20, 100, 500, 1200]) setTimeout(() => console.log("after", t, document.getElementById("root").innerHTML), t);
setTimeout(() => process.exit(0), 1500);
