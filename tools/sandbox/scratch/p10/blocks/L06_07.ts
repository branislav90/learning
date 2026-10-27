import { describe, it, expect } from "vitest";
const cases: Array<[string, boolean]> = [
  ["https://example.com/a", true],
  ["/relative/path", true],
  ["javascript:alert(1)", false],
  ["JaVaScRiPt:alert(1)", false],
  [" javascript:alert(1)", false],
  ["java\tscript:alert(1)", false],     // URL parser strips tabs/newlines — verify the result is still rejected
  ["data:text/html;base64,PHNjcmlwdD4=", false],
  ["//evil.example/x", true],           // resolves to http(s) on another host: allowed by scheme check!
];
