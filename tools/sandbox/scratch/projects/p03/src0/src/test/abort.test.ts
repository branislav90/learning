// @vitest-environment node
import { createMemoryRouter } from "react-router";
import { expect, it } from "vitest";
it("interrupted navigation aborts the first loader's signal", async () => {
  const signals: AbortSignal[] = [];
  const router = createMemoryRouter([
    { path: "/", Component: () => null },
    { path: "/a", loader: ({ request }) => new Promise((r) => { signals.push(request.signal); setTimeout(() => r("a"), 50); }) },
    { path: "/b", loader: () => "b" },
  ]);
  router.initialize();
  void router.navigate("/a");
  await new Promise((r) => setTimeout(r, 10));
  await router.navigate("/b");
  console.log("aborted after interrupt:", signals[0]?.aborted);
  expect(signals[0]?.aborted).toBe(true);
});
