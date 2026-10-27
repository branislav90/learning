import { test } from "vitest";
import { z } from "zod";
test("zod", () => {
  const a = z.string().trim().toLowerCase().email().max(254);
  console.log("old chain", a.safeParse("  Foo@Bar.com ").success, a.safeParse("x").success);
  const b = z.email().max(254);
  console.log("z.email().max", b.safeParse("foo@bar.com").success);
  try { const c = z.email().trim().toLowerCase(); console.log("z.email().trim().toLowerCase()", JSON.stringify(c.safeParse("  Foo@Bar.com ").data)); } catch (e) { console.log("err", String(e)); }
  const s = z.object({ name: z.string().trim().min(3, "At least 3"), visibility: z.enum(["a","b"]) });
  const r = s.safeParse({ name: "x", visibility: "c" });
  if (!r.success) {
    console.log("issues", JSON.stringify(r.error.issues.map(i=>({path:i.path,message:i.message,code:i.code}))));
    console.log("flatten method:", typeof (r.error as any).flatten);
    console.log("z.flattenError", JSON.stringify(z.flattenError(r.error)));
    console.log("treeifyError", JSON.stringify(z.treeifyError(r.error)));
    console.log("prettify", z.prettifyError(r.error));
    console.log("z.formErrors?", typeof (r.error as any).formErrors, typeof (z as any).formatError);
  }
});
