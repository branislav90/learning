from ed import apply
E=[
("""```tsx
test("shows a fallback, then the profile", async () => {
  const d = deferred<{ name: string }>();
  render(<ProfilePage userPromise={d.promise} />);   // promise created OUTSIDE render => stable identity

  expect(screen.getByRole("status")).toHaveTextContent("Loading profile…");

  await act(async () => { d.resolve({ name: "Ada" }); });

  expect(await screen.findByRole("heading", { name: "Ada" })).toBeInTheDocument();
});
```
⚠ If the promise rejects, an **error boundary** is required; test with an `ErrorBoundary` wrapper and silence the *expected* `console.error` noise intentionally (and restore it). React versions differ in how they log errors from boundaries; verify.""",
"""```tsx
test("shows a fallback, then the profile", async () => {
  const d = deferred<{ name: string }>();
  // Render inside an ASYNC act: a component that suspends inside a synchronous act
  // (plain `render(...)`) triggers React's "suspended inside an act scope, but the act call
  // was not awaited" warning, and the boundary never reveals the content (verified).
  await act(async () => { render(<ProfilePage userPromise={d.promise} />); });   // promise created OUTSIDE render => stable identity

  expect(screen.getByRole("status")).toHaveTextContent("Loading profile…");

  await act(async () => { d.resolve({ name: "Ada" }); });

  expect(screen.getByRole("heading", { name: "Ada" })).toBeInTheDocument();
});
```
*Verified on React 19.3.1 + RTL 16.3.3:* this version passes; the same test with a plain `render(...)` and `await findByRole(..., { timeout: 4000 })` never finds the heading, even for `Promise.resolve(...)`. (Outside tests, React reveals content that was suspended after fallback with a ~300 ms throttle; inside `act` the throttle is bypassed.)

If the promise rejects, an **error boundary** is required; render `<ErrorBoundary>` around the `Suspense`, `await act(async () => { d.reject(new Error("nope")) })`, and silence the *expected* `console.error` noise intentionally (and restore it). Verified: React 19 logged one `console.error` call for the caught error in this setup; the count differs between React versions."""),
("(Modern JS also offers `Promise.withResolvers()` ⚠ check Node/jsdom/TS lib support before using it; a small helper is more portable.)","(Modern JS also offers `Promise.withResolvers()`: it exists in Node 24 (verified), but TypeScript needs `lib: [\"ES2024\"]` or later and older browsers/Node lack it; a small helper is more portable.)"),
]
apply("04-testing-async-updates.md",E)
