export {};
vi.useFakeTimers();
vi.spyOn(Math, "random").mockReturnValue(0.5);

it("retries transient errors then succeeds", async () => {
  const op = vi.fn()
    .mockRejectedValueOnce(new HttpError(503))
    .mockResolvedValueOnce("ok");
  const p = withRetry(op, { retries: 2, baseMs: 100, budget: new RetryBudget(1, 10_000, 5) });  // export class for tests
  await vi.advanceTimersByTimeAsync(100);        // random 0.5 * min(cap, 100 * 2^0) = 50ms
  await expect(p).resolves.toBe("ok");
  expect(op).toHaveBeenCalledTimes(2);
});
