import { test } from "vitest";
import "server-only";
test("aliased server-only import is a no-op", () => { console.log("ok: aliased import loaded"); });
