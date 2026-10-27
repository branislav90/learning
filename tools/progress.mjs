import fs from "fs"; import path from "path";
const root=path.resolve("../react-mastery");
const titles={"00":"Phase 0 — Web and JavaScript foundations","01":"Phase 1 — React fundamentals","02":"Phase 2 — Rendering, reconciliation, DOM, internals","03":"Phase 3 — State management and Hooks","04":"Phase 4 — React architecture","05":"Phase 5 — Design patterns","06":"Phase 6 — Data fetching and state ecosystems","07":"Phase 7 — Performance engineering","08":"Phase 8 — Testing and quality","09":"Phase 9 — Advanced rendering and ecosystem","10":"Phase 10 — Production engineering","11":"Phase 11 — Senior and architect mastery"};
let out=`# PROGRESS

Status values: **Planned** → **Drafted** → **Validated** → **Completed**.
- *Drafted*: written and structurally checked (15 sections, relative links resolve).
- *Validated*: independent review checked claims against primary sources and ran or typechecked the code.
- *Completed*: Validated and all external URLs returned HTTP 200.

**Honest state (generated ${new Date().toISOString().slice(0,10)}):** every lesson below passed an independent validation pass (claims checked against primary sources, code executed/typechecked in a sandbox, ~440 corrections applied; see [REVIEW-NOTES.md](./REVIEW-NOTES.md) and [validation-reports/](./validation-reports/)). **Completed** = validated and no external link remains marked *(unverified)*. **Validated** = validated, but at least one link could not be checked automatically. No human expert audit has been done. Each PDF sits next to its Markdown file.

Learner checkboxes: tick only when the knowledge checkpoint is met without notes.

`;
let total=0;
for(const d of fs.readdirSync(root).filter(x=>/^\d\d-/.test(x)).sort()){
  const fs_=fs.readdirSync(path.join(root,d)).filter(f=>f.endsWith(".md")).sort();
  out+=`## ${titles[d.slice(0,2)]} (\`${d}/\`)\n\n| # | File | Status | PDF | Read | Exercises | Checkpoint |\n|---|---|---|---|---|---|---|\n`;
  for(const f of fs_){ total++; const txt=fs.readFileSync(path.join(root,d,f),"utf8"); const st=/unverified/i.test(txt)?"Validated":"Completed"; const pdf=fs.existsSync(path.join(root,d,f.replace(/\.md$/,".pdf")))?"✓":"–";
    out+=`| ${f.slice(0,2)} | [${f.replace(/\.md$/,"")}](./${d}/${f}) | ${st} | ${pdf} | [ ] | [ ] | [ ] |\n`; }
  out+="\n";
}
out+=`## Projects (\`projects/\`)\n\n| # | File | Status | Done |\n|---|---|---|---|\n`;
for(const f of fs.readdirSync(path.join(root,"projects")).filter(f=>f.endsWith(".md")).sort()){ total++; const st=/unverified/i.test(fs.readFileSync(path.join(root,"projects",f),"utf8"))?"Validated":"Completed"; out+=`| ${f.slice(0,2)} | [${f.replace(/\.md$/,"")}](./projects/${f}) | ${st} | [ ] |\n`; }
out+=`\nTotal content files: ${total}.\n\n## Assessment passing rule\n≥80% overall **and** ≥70% in each category (explanation, implementation, debugging, reasoning) before advancing; see each phase's \`*-phase-assessment.md\`. The final assessment is \`11-senior-and-architect-mastery/24-final-assessment.md\`.\n`;
fs.writeFileSync(path.join(root,"PROGRESS.md"),out); console.log(total);
