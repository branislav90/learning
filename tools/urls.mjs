import fs from "fs"; import path from "path";
const root=path.resolve("../react-mastery"); const map=new Map();
(function w(p){for(const f of fs.readdirSync(p)){const q=path.join(p,f);if(fs.statSync(q).isDirectory())w(q);else if(q.endsWith(".md")){
 const s=fs.readFileSync(q,"utf8");
 for(const m of s.matchAll(/https?:\/\/[^\s)>\]"'`*]+/g)){let u=m[0].replace(/[.,;:]+$/,"");(map.get(u)||map.set(u,new Set()).get(u)).add(path.relative(root,q));}}}})(root);
fs.writeFileSync("urls.json",JSON.stringify([...map].map(([u,s])=>({u,files:[...s]})),null,1));
console.log(map.size,"unique urls");
