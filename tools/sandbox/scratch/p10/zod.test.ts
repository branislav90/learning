import { z } from "zod";
import { test } from "vitest";
test("z", () => {
  const S = z.object({ env: z.enum(["development","staging","production"]), apiBaseUrl: z.string().url(),
    monitoring: z.object({ dsn: z.string().url().optional(), sampleRate: z.number().min(0).max(1).default(0.1) }).default({ sampleRate: 0.1 }),
    features: z.record(z.string(), z.boolean()).default({}) });
  const ok = S.safeParse({ env: "production", apiBaseUrl: "https://a.b" });
  console.log("ZOD ok", ok.success, JSON.stringify(ok.success ? ok.data : null));
  const bad = S.safeParse({ env: "x", apiBaseUrl: "nope" });
  console.log("ZOD bad", !bad.success && bad.error.message.slice(0,120).replace(/\s+/g," "));
});
