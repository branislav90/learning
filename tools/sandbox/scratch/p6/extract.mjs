import fs from 'fs';
const dir='/Users/todorbra/Projects/ReactLearning/react-mastery/06-data-fetching-and-state-ecosystems/';
let n=0; const map=[];
for (const f of fs.readdirSync(dir).filter(f=>f.endsWith('.md'))) {
  const lines=fs.readFileSync(dir+f,'utf8').split('\n'); let inb=false, lang='', buf=[], start=0;
  lines.forEach((l,i)=>{
    const m=l.match(/^```(\w*)/);
    if(m && !inb){inb=true;lang=m[1];buf=[];start=i+1;}
    else if(l.startsWith('```')&&inb){inb=false; if(['ts','tsx','typescript'].includes(lang)){const name=`b${f.slice(0,2)}_${start}.${lang==='tsx'||/<[A-Za-z]/.test(buf.join('\n'))?'tsx':'ts'}`; fs.writeFileSync('blocks/'+name,buf.join('\n')+'\nexport {};\n'); n++;} }
    else if(inb) buf.push(l);
  });
}
console.log(n,'blocks');
