import fs from "fs"; import path from "path";
const ok=new Set(JSON.parse(fs.readFileSync("verified.json","utf8")));
const root=path.resolve("../react-mastery"); let removed=0, kept=0;
(function w(p){for(const f of fs.readdirSync(p)){const q=path.join(p,f);if(fs.statSync(q).isDirectory())w(q);else if(q.endsWith(".md")){
 let s=fs.readFileSync(q,"utf8"), inCode=false;
 const out=s.split("\n").map(line=>{
  if(/^```/.test(line)) inCode=!inCode;
  if(inCode||!/unverified/i.test(line) || !/https?:\/\//.test(line)) return line;
  const urls=[...line.matchAll(/https?:\/\/[^\s)>\]"'`*]+/g)].map(m=>m[0].replace(/[.,;:]+$/,""));
  if(urls.length && urls.every(u=>ok.has(u))){removed++; return line.replace(/ ?\*\(unverified[^)]*\)\*/gi,"").replace(/ ?\(unverified[^)]*\)/gi,"").replace(/ ?\(unverified\)/gi,"");}
  kept++; return line;});
 fs.writeFileSync(q,out.join("\n"));}}})(root);
console.log({removed,kept});
