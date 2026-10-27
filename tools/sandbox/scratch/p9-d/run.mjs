import { transformSync } from "@babel/core";
import fs from "fs";
const [,, file, optsJson = "{}"] = process.argv;
const events = [];
const opts = JSON.parse(optsJson);
opts.logger = { logEvent(fn, e) { events.push(e.kind + (e.detail?.reason ? " :: " + e.detail.reason : "") + (e.fnLoc ? " @" + e.fnLoc.start.line : "")); } };
const r = transformSync(fs.readFileSync(file, "utf8"), { filename: file, babelrc:false, configFile:false, presets: [], parserOpts:{plugins:["jsx"]}, plugins: [["babel-plugin-react-compiler", opts]] });
console.log(r.code);
console.log("--- EVENTS\n" + events.join("\n"));
