from patchlib import apply
apply('06',[
("Revalidate path/tag APIs ⚠ verify |","Revalidate path/tag APIs (framework-specific) |"),
("`stale-if-error=<s>` ⚠ (support varies across caches; verify).","`stale-if-error=<s>` (support varies across browsers and CDNs; check MDN's `Cache-Control` page for your targets)."),
("for no visible change ⚠ library option; verify.","for no visible change. (TanStack Query v5: `structuralSharing` defaults to true and `replaceEqualDeep` returned the old reference for deep-equal data in 5.104.)"),
("stay precise ⚠ library generics; verify.","stay precise (`getQueryData<Project>(key)` is a generic in v5)."),
("Large apps with many relationships ⚠ RTK Query-style |","Large apps with many relationships (RTK Query-style) |"),
])
