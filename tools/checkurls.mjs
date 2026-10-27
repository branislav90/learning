import fs from "fs";
const items=JSON.parse(fs.readFileSync("urls.json","utf8")); const res={}; let i=0;
async function one(it){ const u=it.u.replace(/#.*$/,"");
  for(const method of ["HEAD","GET"]){ try{ const c=new AbortController(); const t=setTimeout(()=>c.abort(),20000);
    const r=await fetch(u,{method,redirect:"follow",signal:c.signal,headers:{"user-agent":"Mozilla/5.0 (link-check)"}}); clearTimeout(t);
    if(r.status<400||method==="GET"){res[it.u]={status:r.status,final:r.url};return;} }catch(e){ if(method==="GET")res[it.u]={status:0,err:String(e.cause?.code||e.message)}; } } }
await Promise.all(Array.from({length:24},async()=>{while(i<items.length){await one(items[i++]);}}));
fs.writeFileSync("urlresults.json",JSON.stringify(res,null,1));
const c={};for(const r of Object.values(res)){const k=r.status>=200&&r.status<300?"ok":r.status||"err";c[k]=(c[k]||0)+1}
console.log(c);
