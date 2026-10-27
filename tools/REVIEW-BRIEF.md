# Technical validation brief

You are a technical reviewer validating drafted lessons in `/Users/todorbra/Projects/ReactLearning/react-mastery/`. The lessons were written from memory by other authors; nothing was executed or fetched. Your job is to make them **correct**, editing the lessons in place.

## What to do, for each lesson in your assigned list
1. **Find the risky claims.** `grep -n` the lesson for `⚠`, `verify`, `unverified`, "React 19", "19.", version numbers, API names, and any stated *output / render count / ordering / log sequence*. Also read the lesson's Section 3 (internals) and its predicted-output examples.
2. **Verify against primary sources** (you have network via `curl` in Bash, and WebFetch/WebSearch if available):
   - react.dev reference/learn pages (e.g. `curl -sL https://react.dev/reference/react/useEffect | sed 's/<[^>]*>/ /g'`), react.dev blog (React 19, 19.1, 19.2, later), `https://react.dev/versions`.
   - React source: `https://raw.githubusercontent.com/facebook/react/main/...` or the installed packages in the sandbox (see below).
   - MDN, TypeScript docs, HTML spec, library docs (TanStack Query v5, RTK 2, Zustand 5, XState v5, Vitest, Playwright, MSW 2, Next.js).
3. **Execute what can be executed.** A sandbox exists at `/Users/todorbra/Projects/ReactLearning/tools/sandbox` with react/react-dom 19.3.x, typescript 5.9, vitest 3, jsdom, @testing-library/react + user-event, @tanstack/react-query 5, zustand 5, @reduxjs/toolkit 2, xstate 5, msw 2, zod. Put scratch files in `/Users/todorbra/Projects/ReactLearning/tools/sandbox/scratch/<yourname>/` (create it). Use it to:
   - run render-count / effect-order / batching / Strict Mode predictions with Vitest + RTL (jsdom) or `react-dom/server`;
   - typecheck TypeScript snippets with `npx tsc --noEmit` (jsx: react-jsx, strict);
   - run plain-JS demonstrations (event loop ordering, closures, etc.) with node.
   Prioritise claims where a wrong prediction would teach something false. You need not run every snippet; run the ones that carry a *claim*.
4. **Fix in place** with minimal, surgical edits (Edit tool): correct wrong facts, wrong outputs, wrong API names, broken/outdated code; update version statements; replace unverifiable assertions with accurate hedged ones; keep the lesson's structure, 15 sections, tone, links. If a claim is verified, delete the `⚠`/`verify` marker next to it (or change it to a brief "Verified against react.dev, <date 2026-10-22>" only where valuable). If a newer major of a tool exists than the lesson targets (the sandbox shows React 19.3, TS 7.0, Vitest 5, MSW 3 are released), add a short note rather than rewriting the lesson.
5. **Do not** add filler, change file names, or touch other lessons' files outside your list. Do not edit ROADMAP/PROGRESS/README/GLOSSARY/RESOURCES/REVIEW-NOTES. Do not generate PDFs. Keep every relative link valid.
6. If a lesson's content is fundamentally wrong in a large section, rewrite that section correctly.

## Deliverable
Write a changelog to `/Users/todorbra/Projects/ReactLearning/tools/review/<your-batch-name>.md` (outside react-mastery): per lesson — claims checked, how (source URL or executed script), result (confirmed / corrected / hedged / unresolved), and what you changed. Be honest: list anything you could not verify as **unresolved**. Final reply to the orchestrator: ≤150 words — counts of confirmed/corrected/unresolved, and the 3 most significant corrections.

If you hit transient API/network errors, retry.
