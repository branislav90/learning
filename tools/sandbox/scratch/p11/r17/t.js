const {JSDOM}=require('jsdom'); const dom=new JSDOM('<div id=r></div>',{pretendToBeVisual:true}); global.window=dom.window; global.document=dom.window.document; 
const React=require('react'); const ReactDOM=require('react-dom'); const L=[];
function Demo(){const [a,setA]=React.useState(0),[b,setB]=React.useState(0),[c,setC]=React.useState(0);L.push(`render a=${a} b=${b} c=${c}`);
 async function onClick(){setA(1);setB(1);await new Promise(r=>setTimeout(r,0));setC(1);L.push('after await');}
 return React.createElement('button',{onClick},'go');}
ReactDOM.render(React.createElement(Demo),document.getElementById('r'));
document.querySelector('button').dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true}));
setTimeout(()=>{console.log(L);process.exit()},100);
