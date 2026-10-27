# Authoring brief for react-mastery lessons

You are writing lessons for a textbook-quality React curriculum at `/Users/todorbra/Projects/ReactLearning/react-mastery/`. Read these first:
1. `react-mastery/ROADMAP.md` — version baseline (React 19.x, TS 5.x...), full lesson inventory (exact file names/titles/levels), dependency order. **Use the exact file names listed there**; file name = `NN-slug.md` in the phase directory. When ROADMAP lists `01-foo · 02-bar`, those are `01-foo.md`, `02-bar.md`.
2. `react-mastery/00-web-and-javascript-foundations/01-how-the-browser-works.md` — the **reference for style, depth and structure**. Match it: same 15 numbered sections, same heading names, same tone (textbook + staff-engineer mentor), Mermaid diagrams, tables, "Predict:" prompts, line-by-line code notes.

## Required 15 sections in every lesson (headings `## 1. Lesson metadata` ... `## 15. Knowledge checkpoint`)
1 Lesson metadata (title H1 as `# PP / NN — Title`, level, study time, prerequisites WITH relative links, objectives, concepts covered)
2 Deep conceptual explanation (what, problem solved, why, how, React's exposure, relation to JS/browser, misconceptions; first principles)
3 Internal mechanics (distinguish **public guarantee** / **teaching model** / **implementation detail**; ⚠ flag version-sensitive behavior)
4 Step-by-step execution walkthrough (chronological)
5 Code examples: minimal, practical real-world, incorrect, corrected, advanced (where applicable). Explain important lines, predict result before revealing, explain why, trade-offs, when appropriate. Prefer TypeScript for React code.
6 Visual explanations (Mermaid or text diagrams)
7 Alternative approaches and trade-offs (comparison table with criteria; include a scenario where the recommended approach is NOT best)
8 Best practices and anti-patterns (beginner mistakes, experienced-dev mistakes, smells, justified exceptions; don't present opinions as universal)
9 Real-world application (e-commerce, dashboards, finance, forms, auth, realtime, multi-team...) with engineering constraints
10 Debugging and troubleshooting (symptoms, repro, investigation with DevTools, root cause, validate fix)
11 Exercises Level A Knowledge / B Code comprehension / C Implementation / D Debugging / E Architecture decisions / F Expert challenge (enough of each to verify understanding)
12 Detailed answers and explanations (for EVERY exercise: correct answer, reasoning, why plausible wrong answers fail, sample code, edge cases; for open-ended ones give evaluation criteria + example well-reasoned answer). Start with `> Attempt the exercises first.`
13 Senior engineer interview questions with causal-reasoning answers
14 Further learning resources (table: resource, URL, covers/why, level, section to study)
15 Knowledge checkpoint (understand / explain / implement / debug / prerequisite for next)

## Hard rules
- **Accuracy over volume.** Do not state uncertain facts confidently. Distinguish documented behavior from implementation details. Don't claim exact internal function names/file paths in React unless you are confident; otherwise say "conceptually" and tell the reader to verify in the source.
- **URLs:** Only use URLs you are highly confident exist (documentation hubs/well-known pages: react.dev learn/reference pages, developer.mozilla.org well-known pages, typescriptlang.org/docs, github.com/facebook/react, html.spec.whatwg.org, tanstack.com/query, etc.). Mark any deep link you did not verify as `*(unverified)*`. NEVER invent articles, talks, or blog posts. If you have WebFetch/WebSearch available you may verify; otherwise label. Prefer official docs.
- **Modern React 19.x.** Teach `ref` as a prop, `use`, Actions, `useActionState`, `useOptimistic`, `useFormStatus`, ref cleanup, etc. where relevant; class components, `forwardRef`, `defaultProps`, legacy context, `ReactDOM.render` are historical/legacy and labelled so. Flag version-sensitive items with ⚠. Volatile topics (React Compiler, `useEffectEvent`, framework APIs, RSC bundler integration) must carry a "verify against current docs" note.
- **Code must be correct** (TypeScript that would compile, realistic React). Mentally execute predictions; double-check output claims (render counts, ordering, StrictMode double invocation in dev).
- **Cross-reference** with relative Markdown links to other lessons by exact ROADMAP file names (e.g. `../02-react-rendering-and-internals/11-render-phase-and-commit-phase.md`). Don't re-explain material from earlier lessons; link. Don't depend on concepts not yet introduced; link prerequisites.
- Phase 2's scenario lessons need detailed timelines (what renders / reconciles / commits / is discarded; DOM effect).
- Phase assessment files (`NN-phase-assessment.md`): conceptual questions, code-prediction tasks, debugging challenges, implementation exercises, architecture questions, **detailed answer key**, scoring rubric (≥80% overall and ≥70% per category: explanation, implementation, debugging, reasoning), and promotion criteria. They need not follow the 15-section template.
- Project files (in `react-mastery/projects/`): requirements, learning objectives, recommended architecture, folder structure, milestones, design decisions, testing expectations, performance expectations, common mistakes, review checklist, reference solution guidance (key code), optional extensions.
- No filler, no motivational padding, no "research this yourself" placeholders. Lessons should be long where the topic is complex (typically 4,000–8,000 words; simpler ones 3,000+). Do not shorten later lessons in your batch.
- Write each file with the Write tool (one file at a time). Only create files in your assigned list. Do NOT edit ROADMAP.md, PROGRESS.md, README.md, RESOURCES.md, or GLOSSARY.md, and do NOT generate PDFs (the orchestrator does). Never claim a file exists unless you wrote it.
- At the end, reply with a SHORT report (≤150 words): files written, any facts you were unsure about (so they can be reviewed), and glossary terms worth adding (term: one-line definition, max 10).
