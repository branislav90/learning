from apply import apply
apply('31-reading-react-source.md', [
("a file named like `ReactFiberConfigDOM.js` ⚠ verify;","the file `ReactFiberConfigDOM.js` (confirmed on `main`, with `commitTextUpdate` doing `textInstance.nodeValue = newText`);"),
("whereas for `setTimeout`-initiated updates passive effects typically run after paint. ⚠ This is version-dependent; report your observed order.","whereas for `setTimeout`-initiated updates passive effects typically run after paint (in jsdom, which has no real frames, the passive effect ran before the emulated rAF in both cases). This is version-dependent; report your observed order."),
("`ReactFiberConfigDOM.js` (confirmed","`ReactFiberConfigDOM.js` (confirmed") if False else ("In the repository, search for those *verbs*","In the repository, search for those *verbs*"),
])
