from patchlib import apply
apply('04',[
("(types only; some generators can emit validators ⚠ verify)","(types only; some generators can emit validators; tool-dependent)"),
("outputs usually trusted ⚠ verify)","outputs usually trusted; library-dependent)"),
("| Transformer ⚠ verify |","| Transformer (library-dependent) |"),
("bodies where used ⚠ verify your API |","bodies where used (check your API) |"),
("consider moving parsing to a worker ⚠ measure first |","consider moving parsing to a worker (measure first) |"),
("Relay ⚠ verify per library |","Relay (not verified per library) |"),
("⚠ These defaults vary by library and version — read the docs rather than assuming.","These defaults vary by library and version (Zod 4: unknown keys are stripped and issues accumulate; verified) — read the docs rather than assuming."),
("type policies ⚠ *library-specific — verify*,","type policies (library-specific, not verified here),"),
("covers infinite queries ⚠ verify).","covers infinite queries; `useInfiniteQuery` and a required `initialPageParam` exist in 5.104)."),
("ids are plain strings. ⚠ Branding is erased","ids are plain strings. Branding is erased"),
("| Codegen + generated validators ⚠ |","| Codegen + generated validators |"),
("pagination ⚠ verify; REST part:","pagination (not verified here); REST part:"),
("Entity tables and selectors ⚠ verify current API |","Entity tables and selectors (`createEntityAdapter` exists in RTK 2.13) |"),
("Schema parsing, transforms ⚠ verify version |","Schema parsing, transforms (snippet run on Zod 4.6) |"),
])
apply('08',[("> ⚠ **Version-sensitive.** In v4, `isLoading`","> **Version-sensitive (verified in 5.104).** In v4, `isLoading`")])
apply('19',[("). ⚠ Framework data APIs are the most volatile part of this ecosystem: verify against current docs","). Framework data APIs are the most volatile part of this ecosystem (not verified in this review): verify against current docs")])
apply('13',[("> ⚠ **Verify against current docs.** This lesson targets **React 19.x**.","> **Checked against React 19.3 and react.dev (2026-10-22).** This lesson targets **React 19.x**.")])
