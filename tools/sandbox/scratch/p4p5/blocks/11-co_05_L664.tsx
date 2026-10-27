import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Rating", () => {
  it("uncontrolled: updates itself and notifies", async () => {
    const onValueChange = vi.fn();
    render(<Rating defaultValue={2} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByLabelText("4 of 5"));
    expect(onValueChange).toHaveBeenCalledWith(4);
    expect(screen.getByLabelText("4 of 5")).toBeChecked();
  });

  it("controlled: does not update itself; follows props", async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Rating value={2} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByLabelText("4 of 5"));
    expect(onValueChange).toHaveBeenCalledWith(4);
    expect(screen.getByLabelText("2 of 5")).toBeChecked();      // unchanged: parent did not accept
    rerender(<Rating value={4} onValueChange={onValueChange} />);
    expect(screen.getByLabelText("4 of 5")).toBeChecked();
  });
});
export {};
