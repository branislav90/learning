// @vitest-environment jsdom
import React,{useState,useLayoutEffect,Profiler} from "react";
import {render,act} from "@testing-library/react";
import {test} from "vitest";
test("nested",()=>{const ph:string[]=[];let set:any;
 function C(){const [s,S]=useState(0);set=S;useLayoutEffect(()=>{if(s===1)S(2)},[s]);return <i>{s}</i>}
 render(<Profiler id="x" onRender={(_,p)=>ph.push(p)}><C/></Profiler>);act(()=>set(1));console.log("PH",ph.join());});
