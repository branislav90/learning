import fs from "fs"; import path from "path";
const root = path.resolve("../react-mastery");
const files=[]; (function w(p){for(const f of fs.readdirSync(p)){const q=path.join(p,f);fs.statSync(q).isDirectory()?w(q):q.endsWith(".md")&&files.push(q)}})(root);
const broken=new Map(); let total=0;
for(const f of files){
  const s=fs.readFileSync(f,"utf8").replace(/```[\s\S]*?```/g,"");
  for(const m of s.matchAll(/\]\(([^)\s]+?)\)/g)){
    let l=m[1]; if(/^(https?:|mailto:|#)/.test(l))continue; l=l.split("#")[0]; if(!l)continue;
    total++; const t=path.resolve(path.dirname(f),l);
    if(!fs.existsSync(t)){const k=path.relative(root,t); (broken.get(k)||broken.set(k,[]).get(k)).push(path.relative(root,f));}
  }
}
console.log(files.length,"md files;",total,"relative links;",[...broken.values()].reduce((a,b)=>a+b.length,0),"broken");
for(const [k,v] of broken) console.log(k,"<-",v.length,"e.g.",v[0]);
