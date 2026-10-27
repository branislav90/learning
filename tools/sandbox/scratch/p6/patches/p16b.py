from patchlib import apply
apply('16',[
("(Chromium-centric; verify)","(MDN compat data lists `saveData` as Chrome 65 only, no Firefox or Safari)"),
("(`idb` is a community promise wrapper over IndexedDB (verify).","(`idb` is a community promise wrapper over IndexedDB (not checked here)."),
("use the Web Locks API (`navigator.locks`) for cross-tab exclusion, verify support)","use the Web Locks API (`navigator.locks`; MDN compat: Chrome 69, Firefox 96, Safari 15.4) for cross-tab exclusion)"),
("Quota/eviction rules (verify) |","Quota/eviction rules (not re-verified; they change) |"),
])
