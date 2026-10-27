from apply import apply
apply('33-scenario-b-text-update.md', [
("(If `name` is an empty string, its text fiber/node may be empty; an empty string child still occupies a position in the array, ⚠ whether a zero-length DOM text node is created is an implementation detail — verify via `childNodes`.)","(If `name` is an empty string, no DOM text node is created for it: executed on 19.3.1, `<p>Hello {''}, you have {0} items</p>` had four text nodes, `\"Hello \"`, `\", you have \"`, `\"0\"`, `\" items\"`; `<p>{''}</p>` had zero child nodes. When `name` later becomes non-empty a node is inserted, which is a `childList` change, not `characterData`.)"),
("React DOM tries to use the former when the sole child already is a text node (⚠ verify in your version).","React DOM uses the former when the sole child already is a text node (executed on 19.3.1: `characterData` record, same node)."),
("Mitigation ⚠ verify: wrap dynamic text","Mitigation (community guidance, not a React guarantee): wrap dynamic text"),
("is a known mitigation ⚠ verify with current community guidance.","is a known community mitigation (not a React guarantee)."),
("while replacing the container may re-announce everything ⚠ behavior varies by assistive technology.","while replacing the container may re-announce everything (behavior varies by assistive technology)."),
("⚠ Assistive-technology behavior varies;","Assistive-technology behavior varies;"),
("a cached `firstChild` reference in an imperative library) can break. ⚠ This matches the DOM host's text-content handling in the React 17–19 sources the author knows; confirm with the experiment:","a cached `firstChild` reference in an imperative library) can break. Executed on 19.3.1: `{n}` going from `0` to `''` removed the text node (`childList`), and going back inserted a new one; confirm with the experiment:"),
("The terms HostText and \"text content optimization\" describe how","(Names confirmed in the source: `HostText` fibers and `shouldSetTextContent`.) The terms HostText and \"text content optimization\" describe how") if False else ("⚠ The terms HostText and \"text content optimization\" describe how","The terms HostText and \"text content optimization\" describe how"),
])
apply('34-scenario-c-list-reorder.md', [
("may differ ⚠ consider a11y:","may differ; consider a11y:"),
("⚠ Verify the current rule names in the plugin docs.","Both rule names exist in the plugin (checked 2026-10-22)."),
])
apply('23-transitions-and-deferred-rendering.md', [
("⚠ Implementation detail: durations and mechanism are not public;","Implementation detail (constants checked in `ReactFiberLane.js`): durations and mechanism are not public;"),
])
apply('29-reasoning-about-unnecessary-renders.md', [
("⚠ Implementation vocabulary (lanes/childLanes) is in [14](./14-lanes.md); verify in source ([31](./31-reading-react-source.md)).","Implementation vocabulary (lanes/childLanes) is in [14](./14-lanes.md); trace it in the source ([31](./31-reading-react-source.md))."),
])
apply('21-browser-paint-and-react-updates.md', [
("React Profiler shows effect time in newer DevTools versions ⚠.","React Profiler shows effect time in newer DevTools versions (not verified here)."),
])
