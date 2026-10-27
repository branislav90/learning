import { defineConfig } from "vitest/config";
import { transformSync } from "@babel/core";
import rc from "babel-plugin-react-compiler";
export default defineConfig({
  plugins: [{ name: "rcplug", enforce: "pre", transform(code, id) {
    if (!id.endsWith(".compiled.jsx")) return;
    const r = transformSync(code, { filename: id, babelrc:false, configFile:false, parserOpts:{plugins:["jsx"]}, plugins: [[rc, {panicThreshold:"all_errors"}]] });
    return { code: r.code, map: null };
  }}],
  esbuild: { jsx: "automatic" },
  test: { environment: "jsdom", include: ["rc/*.test.jsx"] },
});
