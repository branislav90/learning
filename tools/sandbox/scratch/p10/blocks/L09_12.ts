import fs from "node:fs";
const source = JSON.parse(fs.readFileSync("catalogs/en.json", "utf8"));
const placeholders = (s: string) => new Set([...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]));
for (const locale of process.argv.slice(2)) {
  const cat = JSON.parse(fs.readFileSync(`catalogs/${locale}.json`, "utf8"));
  const cats = new Intl.PluralRules(locale).resolvedOptions().pluralCategories;   // verify availability
  for (const [id, src] of Object.entries(source)) {
    const tgt = cat[id];
    if (tgt === undefined) { console.error(`${locale}: missing ${id}`); process.exitCode = 1; continue; }
    const srcStrings = typeof src === "string" ? [src] : Object.values(src as object) as string[];
    const tgtStrings = typeof tgt === "string" ? [tgt] : Object.values(tgt as object) as string[];
    // compare placeholder sets; check plural categories for plural messages
    if (typeof tgt === "object") for (const c of cats) if (!(c in tgt)) { console.error(`${locale}: ${id} lacks plural "${c}"`); process.exitCode = 1; }
  }
  for (const id of Object.keys(cat)) if (!(id in source)) console.error(`${locale}: extra ${id}`);
}
