import fs from "fs"; import path from "path";
const root=path.resolve("../react-mastery"); let bad=[], n=0, words=0;
for(const d of fs.readdirSync(root)){ if(!/^\d\d-/.test(d))continue;
 for(const f of fs.readdirSync(path.join(root,d)).filter(x=>x.endsWith(".md"))){
  const s=fs.readFileSync(path.join(root,d,f),"utf8"); words+=s.split(/\s+/).length;
  if(/assessment/.test(f)) continue; n++;
  const heads=[...s.matchAll(/^## (\d+)\. /gm)].map(m=>+m[1]);
  const miss=[...Array(15)].map((_,i)=>i+1).filter(i=>!heads.includes(i));
  if(miss.length) bad.push(d+"/"+f+" missing "+miss.join(","));
 }}
console.log(n,"lessons checked;",words,"words total;",bad.length,"with missing sections"); bad.forEach(b=>console.log(b));
