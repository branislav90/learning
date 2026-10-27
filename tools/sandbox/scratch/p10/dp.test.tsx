import React from "react";
import { jsx } from "react/jsx-runtime";
import { renderToString } from "react-dom/server";
import { test } from "vitest";
test("dp", () => {
  function D({a}: {a?: string}){ return <i>{String(a)}</i>; }
  (D as any).defaultProps = { a: "dflt" };
  console.log("DP jsx:", renderToString(jsx(D, {})), "createElement:", renderToString(React.createElement(D)));
  class K extends React.Component<{a?:string}> { static defaultProps = {a:"kd"}; render(){ return <i>{String(this.props.a)}</i>; } }
  console.log("DP class jsx:", renderToString(jsx(K, {})));
});
