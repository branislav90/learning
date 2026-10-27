import React from "react";
import { renderToString } from "react-dom/server";
import { test } from "vitest";
test("i",()=>{ console.log("IN", renderToString(<div><i inert={true}/><b inert={false}/></div>)); });
