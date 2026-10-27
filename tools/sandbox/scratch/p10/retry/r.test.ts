import { test, expect } from "vitest";
import { withRetry, HttpError } from "./retry";
test("retries", async () => {
  let n = 0;
  const r = await withRetry(async () => { n++; if (n < 3) throw new HttpError(503); return "ok"; }, { baseMs: 1 });
  expect(r).toBe("ok"); expect(n).toBe(3);
  let m = 0;
  await expect(withRetry(async () => { m++; throw new HttpError(400); }, { baseMs: 1 })).rejects.toBeInstanceOf(HttpError);
  expect(m).toBe(1);
  let k = 0;
  await expect(withRetry(async () => { k++; throw new HttpError(503); }, { baseMs: 1, retries: 5 })).rejects.toBeInstanceOf(HttpError);
  console.log("attempts with retries:5 =", k);
});
