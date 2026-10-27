import * as mod from "./rename-import";
import { runInlineTest } from "jscodeshift/dist/testUtils";
import fs from "node:fs";
const fx = (n: string) => fs.readFileSync(`${__dirname}/__testfixtures__/${n}.tsx`, "utf8");
for (const name of ["basic", "aliased-import", "already-migrated"]) {
  it(name, () => {
    runInlineTest(mod as any, null, { source: fx(`${name}.input`), path: `${name}.tsx` }, fx(`${name}.output`));
  });
}
