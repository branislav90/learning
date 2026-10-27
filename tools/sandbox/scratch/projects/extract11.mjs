import fs from 'fs';
const lines = fs.readFileSync('/Users/todorbra/Projects/ReactLearning/react-mastery/projects/11-broken-app-diagnose-and-refactor.md','utf8').split('\n');
function grab(from,to,outDir){
  let path=null;
  for(let i=from;i<to;i++){
    const l=lines[i];
    let m=l.match(/^`((?:src|tests)\/[^`]+)`/)||l.match(/^### C\.\d+ `((?:src)\/[^`]+)`/);
    if(m) path=m[1];
    if(l.startsWith('```')&&!l.startsWith('```text')&&path&&l.length>3){
      let j=i+1;const buf=[];
      while(!lines[j].startsWith('```')){buf.push(lines[j]);j++;}
      fs.mkdirSync(outDir+'/'+path.split('/').slice(0,-1).join('/'),{recursive:true});
      fs.writeFileSync(outDir+'/'+path,buf.join('\n')+'\n');
      console.log(outDir,path);
      path=null;i=j;
    }
  }
}
//
grab(1204,1960,'p11/fixed');
