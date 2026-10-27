const flag = { explode: true };
function Bomb() { if (flag.explode) throw new Error("boom"); return <p>ok</p>; }

test("recovers after reset", async () => {
  const user = userEvent.setup();
  const spy = vi.spyOn(console, "error").mockImplementation(() => {});   // React logs caught errors
  render(
    <ErrorBoundary fallback={({ reset }) => <button onClick={() => { flag.explode = false; reset(); }}>retry</button>}>
      <Bomb />
    </ErrorBoundary>,
  );
  await user.click(screen.getByRole("button", { name: "retry" }));
  expect(screen.getByText("ok")).toBeInTheDocument();
  spy.mockRestore();
});
export {};
