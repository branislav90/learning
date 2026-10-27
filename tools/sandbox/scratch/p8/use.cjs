const { JSDOM } = require("jsdom");
const dom = new JSDOM("<div id=root></div>");
globalThis.window = dom.window; globalThis.document = dom.window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = false;
const React = require("react"); const { createRoot } = require("react-dom/client");
function P({ p }) { const u = React.use(p); return React.createElement("h2", null, u.name); }
const root = createRoot(document.getElementById("root"));
const p = Promise.resolve({ name: "Bob" });
root.render(React.createElement(React.Suspense, { fallback: "loading" }, React.createElement(P, { p })));
setTimeout(() => console.log("after 200ms:", document.getElementById("root").innerHTML), 2000);
setTimeout(() => process.exit(0), 2600);
