import fs from 'fs';
const [,, num] = process.argv;
const dir='/Users/todorbra/Projects/ReactLearning/react-mastery/projects/';
const f=fs.readdirSync(dir).find(x=>x.startsWith(num+'-')&&x.endsWith('.md'));
const lines=fs.readFileSync(dir+f,'utf8').split('\n');
const out=`p${num}/src0`;
let n=0, seen={};
for(let i=0;i<lines.length;i++){
  const m=lines[i].match(/^```(tsx?|ts|tsx|css|json|html|js|jsx|mjs)\s*$/);
  if(!m) continue;
  let j=i+1;const buf=[];
  while(j<lines.length&&!lines[j].startsWith('```')){buf.push(lines[j]);j++;}
  let path=null;
  const first=buf[0]||'';
  let mm=first.match(/^\/\/\s*([\w@./\-\[\]$()]+\.(?:tsx?|css|json|js|mjs))\b/);
  if(mm) path=mm[1];
  else { for(let k=i-1;k>=Math.max(0,i-3);k--){const pm=lines[k].match(/^`?([\w@./\-\[\]$()]+\.(?:tsx?|css|json|js|mjs|html))`?:?\s*$/)||lines[k].match(/^### [\d.]+ `([^`]+)`/); if(pm){path=pm[1];break;}} }
  console.log(`${i+1}\t${m[1]}\t${path??'-'}\t${buf.length}`);
  if(path){ if(seen[path]) {path=path.replace(/(\.\w+)$/,`.dup${++n}$1`);} seen[path]=1;
    fs.mkdirSync(out+'/'+path.split('/').slice(0,-1).join('/'),{recursive:true}); fs.writeFileSync(out+'/'+path,buf.join('\n')+'\n'); }
  i=j;
}
