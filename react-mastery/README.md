# React Mastery — Beginner to Architect

A file-based technical textbook. Each lesson is a Markdown file with the same 15-part structure.

## Start here
1. Read [ROADMAP.md](./ROADMAP.md) for the plan, versions, and dependency order.
2. Track your work in [PROGRESS.md](./PROGRESS.md).
3. Begin at [00 / 01 — How the browser works](./00-web-and-javascript-foundations/01-how-the-browser-works.md).

## How to study a lesson
1. Read metadata and objectives; check prerequisites.
2. Read sections 2–4 (concept, mechanics, walkthrough). When a lesson says **Predict**, write your prediction down *before* reading on.
3. Run the examples (see below). Change them and break them.
4. Do the exercises (section 11) **without opening the answers** (section 12).
5. Answer the interview questions out loud, then compare.
6. Tick the knowledge checkpoint in PROGRESS.md only if you can do every item without notes.

## Running examples
Most examples are small modules. Use a Vite + TypeScript sandbox:

```bash
npm create vite@latest sandbox -- --template react-ts
cd sandbox && npm install && npm run dev
```

Phase 0 examples run in the browser console or with Node (`node file.mjs`).

## Lesson sections
1 Metadata · 2 Concept · 3 Internal mechanics · 4 Execution walkthrough · 5 Code · 6 Visuals · 7 Alternatives & trade-offs · 8 Best practices / anti-patterns · 9 Real-world application · 10 Debugging · 11 Exercises (A–F) · 12 Answers · 13 Interview questions · 14 Resources · 15 Knowledge checkpoint

## Honesty conventions
- **Public guarantee** = documented behavior you may rely on. **Teaching model** = simplification. **Implementation detail** = how React currently works internally; it can change.
- External URLs were checked for HTTP 200 on 2026-10-22 (about 920 returned 200); the few still marked *(unverified)* were blocked or unreachable for automated checks. A 200 does not prove the page content matches its description.
- Status in PROGRESS.md is one of: Planned → Drafted → Validated → Completed.

## What's here
- 12 phase directories (`00`–`11`) with 265 lessons + phase assessments, 11 projects in `projects/`. Each `X.md` has a matching `X.pdf` next to it.
- [REVIEW-NOTES.md](./REVIEW-NOTES.md) lists the version-sensitive claims that need checking against current docs. Treat the curriculum as a strong first draft, not a verified reference.
- Start with Phase 0 (or skip to the phase matching your level); take each phase assessment before advancing (≥80% overall, ≥70% per category).
- Suggested project order is in [ROADMAP.md §4](./ROADMAP.md).

## Rebuilding the PDFs
From `../tools`: `npm install` then `node md2pdf.mjs ../react-mastery` (needs Google Chrome; converts only changed files; `--force` rebuilds all). `node linkcheck.mjs` verifies relative links.
