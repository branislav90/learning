// Usage: node md2pdf.mjs <root-dir | file.md> ...   (writes X.pdf next to X.md; skips up-to-date PDFs unless --force)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import hljs from "highlight.js";
import puppeteer from "puppeteer-core";

const here = path.dirname(fileURLToPath(import.meta.url));
const mermaidJs = fs.readFileSync(path.join(here, "node_modules/mermaid/dist/mermaid.min.js"), "utf8");
const hlCss = fs.readFileSync(path.join(here, "node_modules/highlight.js/styles/github.css"), "utf8");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  highlight(code, lang) {
    if (lang === "mermaid") return `<pre class="mermaid">${md.utils.escapeHtml(code)}</pre>`;
    if (lang && hljs.getLanguage(lang)) {
      try { return `<pre class="hljs"><code>${hljs.highlight(code, { language: lang }).value}</code></pre>`; } catch {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`;
  },
}).use(anchor);

const css = `
@page { size: A4; margin: 18mm 15mm; }
body { font: 10.5pt/1.5 -apple-system, "Helvetica Neue", Arial, sans-serif; color: #1a1a1a; }
h1 { font-size: 21pt; border-bottom: 2px solid #333; padding-bottom: 4px; }
h2 { font-size: 15pt; margin-top: 22px; border-bottom: 1px solid #ccc; padding-bottom: 2px; }
h3 { font-size: 12.5pt; } h4 { font-size: 11pt; }
code { font: 9pt Menlo, Consolas, monospace; background: #f1f3f5; padding: 1px 4px; border-radius: 3px; }
pre.hljs { background: #f6f8fa; padding: 8px 10px; border-radius: 4px; white-space: pre-wrap; word-break: break-word; page-break-inside: avoid; }
pre.hljs code { background: none; padding: 0; font-size: 8.5pt; }
pre.mermaid { text-align: center; background: #fff; page-break-inside: avoid; }
pre.mermaid svg { max-width: 100%; height: auto; }
table { border-collapse: collapse; width: 100%; margin: 10px 0; font-size: 9.5pt; page-break-inside: auto; }
tr { page-break-inside: avoid; }
th, td { border: 1px solid #bbb; padding: 4px 6px; vertical-align: top; }
th { background: #eef0f3; }
blockquote { border-left: 4px solid #aaa; margin: 8px 0; padding: 2px 12px; color: #444; background: #fafafa; }
a { color: #0b5cad; text-decoration: none; word-break: break-word; }
hr { border: 0; border-top: 1px solid #ccc; }
${hlCss}
`;

function walk(p, out = []) {
  const st = fs.statSync(p);
  if (st.isFile()) { if (p.endsWith(".md")) out.push(p); return out; }
  for (const f of fs.readdirSync(p)) if (f !== "node_modules") walk(path.join(p, f), out);
  return out;
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const files = args.filter((a) => a !== "--force").flatMap((a) => walk(path.resolve(a)));
const todo = files.filter((f) => {
  const pdf = f.replace(/\.md$/, ".pdf");
  return force || !fs.existsSync(pdf) || fs.statSync(pdf).mtimeMs < fs.statSync(f).mtimeMs;
});
console.log(`${todo.length} of ${files.length} files to convert`);
if (!todo.length) process.exit(0);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
let ok = 0, failed = [];
for (const f of todo) {
  try {
    // rewrite relative .md links to .pdf so cross-references work among PDFs
    const src = fs.readFileSync(f, "utf8");
    let body = md.render(src).replace(/href="([^":#]+?)\.md(#[^"]*)?"/g, 'href="$1.pdf$2"');
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${body}<script>${mermaidJs}</script></body></html>`;
    const tmp = f.replace(/\.md$/, ".tmp.html");
    fs.writeFileSync(tmp, html);
    const page = await browser.newPage(); page.setDefaultTimeout(90000);
    await page.goto("file://" + tmp, { waitUntil: "load" });
    await Promise.race([new Promise(r=>setTimeout(r,90000)), page.evaluate(async () => {
      const nodes = document.querySelectorAll("pre.mermaid");
      if (nodes.length) {
        mermaid.initialize({ startOnLoad: false, securityLevel: "loose", theme: "neutral" });
        try { await mermaid.run({ nodes: [...nodes], suppressErrors: true }); } catch (e) {}
      }
    })]);
    await page.pdf({ path: f.replace(/\.md$/, ".pdf"), format: "A4", printBackground: true,
      displayHeaderFooter: true, headerTemplate: "<span></span>",
      footerTemplate: `<div style="font-size:8px;width:100%;text-align:center;color:#666"><span class="pageNumber"></span>/<span class="totalPages"></span></div>`,
      margin: { top: "18mm", bottom: "18mm", left: "15mm", right: "15mm" } });
    await page.close();
    fs.unlinkSync(tmp);
    ok++;
  } catch (e) { failed.push([f, String(e)]); }
}
await browser.close();
console.log(`done: ${ok} ok, ${failed.length} failed`);
for (const [f, e] of failed) console.log("FAIL", f, e);
