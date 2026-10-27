import ts from 'typescript';
const src = `const a=<div {...p} key="x"/>; const b=<div key="y" {...p}/>; const c=<div key="z" id="1"/>; const d=<><a/></>;`;
console.log(ts.transpileModule(src,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,target:99}}).outputText);
console.log(ts.transpileModule(src,{compilerOptions:{jsx:ts.JsxEmit.ReactJSXDev,target:99}}).outputText);
