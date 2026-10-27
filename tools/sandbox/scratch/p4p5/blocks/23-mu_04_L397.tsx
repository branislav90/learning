import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { VehiclePicker } from "../index";

describe("contract: billing uses VehiclePicker", () => {
  it("calls onChange with a vehicle id string when a vehicle is chosen", async () => {
    const onChange = vi.fn();
    render(<VehiclePicker vehicles={[{ id: "v1", plate: "AB123CD", label: "Van 1" }]} onChange={onChange} />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(await screen.findByRole("option", { name: /Van 1/ }));
    expect(onChange).toHaveBeenCalledWith("v1");
  });

  it("is labelled so billing forms can associate a label", () => {
    render(<VehiclePicker vehicles={[]} onChange={() => {}} aria-label="Vehicle" />);
    expect(screen.getByLabelText("Vehicle")).toBeInTheDocument();
  });
});
export {};
