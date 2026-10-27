import sys,re; sys.path.insert(0,'/tmp')
from rep import rep
f='/Users/todorbra/Projects/ReactLearning/react-mastery/04-react-architecture/09-feature-sliced-design.md'
s=open(f).read()
reps=[
("> ⚠ **Verify against current official documentation.** Feature-Sliced Design (FSD) is a community-maintained specification that has changed between versions (notably the 2.0 → 2.1 transition, the deprecation of the `processes` layer, and guidance about when to extract code from pages). This lesson describes the layers and rules as documented at <https://feature-sliced.design> when this lesson was written (the `reference/layers` page was consulted). Before adopting it, re-read the current docs.",
 "> **Checked against feature-sliced.design (v2.1 docs: reference/layers, slices-segments, public-api, with-nextjs; 2026-10-22).** FSD is a community-maintained specification that has changed between versions (notably the 2.0 → 2.1 transition and the deprecation of the `processes` layer). Layers, order, the import rule, `@x` notation, segment names and the `app`/`shared` exception below match the current docs; re-read them before adopting FSD."),
("cross-import notation (`@x`, ⚠ verify)","cross-import notation (`@x`)"),
("Steiger linter (⚠ verify)","Steiger linter"),
("Notes (all ⚠ verify in the current docs):","Notes (checked against the layers reference):"),
("`shared` may have `routes`, `i18n`). ⚠ Verify the current list.","`shared` may have `routes`, `i18n`; shared also commonly has `api`, `ui`, `lib`, `config`)."),
("⚠ Verify the exact notation in the current docs; and note that the docs themselves advise","The notation is `entities/A/@x/B.ts` (\"A crossed with B\"), imported by B as `entities/A/@x/B`; the docs advise using it only on the Entities layer, and note that they advise"),
("Optional tooling exists (linters, ⚠ verify names such as Steiger).","Optional tooling exists (the docs mention an official linter, Steiger, plus CLI/IDE folder generators)."),
("Approaches (⚠ verify current tool names/config before use):","Approaches (the first three tool families exist as of 2026-10-22; Steiger is `steiger` 0.8.x with `@feature-sliced/steiger-plugin`, still pre-1.0):"),
("(⚠ verify maturity)","(Steiger is pre-1.0, 0.8.x)"),
("the docs have guidance on combining them (⚠ verify current recommended approach).","the docs' Next.js guide recommends prefixed layer folders (e.g. `_app`, `_pages` under `src/`) alongside the framework's own `app/` and `pages/` folders at the project root."),
("(docs advocate not over-extracting; ⚠ verify current wording)","(the layers reference says a UI block that is not reused is fine inside the page slice)"),
("(⚠ confirm in c","(confirmed in c"),
("(// eslint.config.js (sketch — verify pattern syntax for your ESLint version)","(// eslint.config.js (sketch)"),
]
for o,n in reps:
    if s.count(o)!=1: print("MISS",o[:50],s.count(o))
    else: s=s.replace(o,n)
open(f,'w').write(s)
