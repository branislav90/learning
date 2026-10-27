# REVIEW-NOTES — validation outcome (2026-10-22)

Every lesson was reviewed by an independent pass that (1) checked flagged and high-risk claims against primary sources (react.dev, React source on GitHub, MDN, TypeScript docs, library docs), (2) **executed** code and predicted outputs in a sandbox (React 19.3.1, TypeScript 5.9, Vitest 3, jsdom, Testing Library, TanStack Query 5, Zustand 5, RTK 2, XState 5, MSW 2), and (3) corrected the lessons in place. Per-batch changelogs with sources and scripts are in [validation-reports/](./validation-reports/).

## Scale of the review
| Batch | Confirmed | Corrected | Unresolved / hedged |
|---|---|---|---|
| P0–P1 (41 lessons) | ~124 | ~31 | ~32 |
| P2 01–19 | ~62 | ~31 | ~9 |
| P2 20–38 | ~61 | ~33 | ~33 |
| P3 | ~166 | ~37 | ~5 |
| P4–P5 | ~60 | ~22 | ~6 |
| P6 | ~115 | ~24 | ~16 |
| P7 | ~106 | ~34 | ~21 |
| P8 | ~85 | ~45 | ~23 |
| P9 | ~190 | ~100 | ~40 |
| P10 | ~45 | ~35 | ~12 |
| P11 | ~60 | ~25 | ~12 |
| Projects | ~75 | ~25 | ~12 |

Roughly 440 corrections were made — the drafts contained a meaningful number of wrong claims, which is why this pass mattered. Examples: Phase 2's host-prop-diffing narration, hydration event replay, `useOptimistic` flicker, `flushSync` and passive effects, the Vitest fake-timer + Testing Library hang, DORA's fifth metric, WCAG 2.4.13 level, a heartbeat bug in lesson 06/17 code, broken dependency-cruiser rules, and several broken code samples (verified with `tsc`/Vitest). Project 11's 12 documented defects were all reproduced and its fixed source builds on Vite 8.

## URL verification
~1,000 unique URLs extracted; ~920 returned HTTP 200 (dead ones fixed or removed). The rest are placeholder/example hosts in code, or sites that block automated requests (ACM, Medium, npm). A 200 response is not proof the page still says what the table claims.

## What is still not verified
- **Real-browser behaviour** (paint/compositor timing, IME/caret, focus, HTTP caching, bfcache, Core Web Vitals in the field): checked in jsdom/Node or by documentation only.
- **DevTools UI labels** and screenshots-by-description.
- **Framework specifics** that move fast: Next.js, React Router 8, TanStack Start, RSC bundler integration, React Compiler options. Checked against docs and, where possible, installed packages — re-verify before depending on them.
- **Newer majors than the lessons target** exist at validation time (React 19.3, TypeScript 6/7, Vitest 4/5, MSW 3, React Router 8, Vite 8, ESLint 10); the lessons note this where it changes behaviour but still teach Vitest 3 / MSW 2 / TS 5 in places. Known example: on Vitest 3 + jsdom, `fetch(url, {signal})` throws (fixed in Vitest 4+).
- Items listed as **unresolved** in each file under `validation-reports/`.
- **No human domain-expert review** has occurred. "Validated" below means AI-assisted verification against primary sources plus execution, not a human audit.
