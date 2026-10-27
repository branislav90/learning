import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// Probe counts renders (module) and commits (layout effect) of SlowResults
it("abandons at least one transition render when typing fast", async () => {
  render(<SearchWithProbe />);
  const input = screen.getByRole("textbox");
  await userEvent.setup({ delay: null }).type(input, "abc");
  await screen.findByText(/abc · result 0/);
  expect(probe.commits).toBeLessThan(probe.renders);   // brittle
});
export {};
