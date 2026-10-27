export {};
function Bomb({ explode }: { explode: boolean }) {
  if (explode) throw new Error("boom");
  return <p>ok</p>;
}
it("shows fallback and recovers when resetKeys change", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});   // React logs caught errors
  const fallback = ({ reset }: { error: Error; reset: () => void }) => <button onClick={reset}>retry</button>;
  const { rerender } = render(<ErrorBoundary fallback={fallback} resetKeys={[1]}><Bomb explode /></ErrorBoundary>);
  expect(screen.getByRole("button", { name: "retry" })).toBeInTheDocument();
  rerender(<ErrorBoundary fallback={fallback} resetKeys={[2]}><Bomb explode={false} /></ErrorBoundary>);
  expect(screen.getByText("ok")).toBeInTheDocument();
});
