import React from "react";
import { renderToString } from "react-dom/server";
import { test } from "vitest";
test("x",()=>{
 console.log(renderToString(<a href="https://x.com">x</a>), renderToString(<a href={"//evil.com"}>x</a>), renderToString(<a href={"java\tscript:1"}>x</a>), renderToString(<button {...{formAction:"javascript:1"}}>x</button>), renderToString(<object data="javascript:1"/>), renderToString(<a href="data:text/html,1">x</a>));
});
