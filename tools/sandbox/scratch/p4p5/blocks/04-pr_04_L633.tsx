// presentational (above) + test
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PriceLabel } from "./PriceLabel";

test("renders a button when selectable and calls onSelect", async () => {
  const onSelect = vi.fn();
  render(<PriceLabel amountText="£9.99" onSelect={onSelect} />);
  await userEvent.click(screen.getByRole("button", { name: "£9.99" }));
  expect(onSelect).toHaveBeenCalledOnce();
});
test("renders text when not selectable", () => {
  render(<PriceLabel amountText="£9.99" />);
  expect(screen.queryByRole("button")).toBeNull();
  expect(screen.getByText("£9.99")).toBeInTheDocument();
});
export {};
