import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Counter } from "./Counter";

describe("Counter (characterization)", () => {
  it("starts at 0", () => {
    render(<Counter />);
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });
  it("+ increments", async () => {
    render(<Counter />);
    await userEvent.click(screen.getByRole("button", { name: "+" }));
    expect(screen.getByTestId("count")).toHaveTextContent("1");
  });
  it("− below 0 is silently ignored", async () => {
    render(<Counter />);
    await userEvent.click(screen.getByRole("button", { name: "−" }));
    expect(screen.getByTestId("count")).toHaveTextContent("0");
  });
  it("shows Max at 10", async () => {
    render(<Counter />);
    for (let i = 0; i < 10; i++) await userEvent.click(screen.getByRole("button", { name: "+" }));
    expect(screen.getByText("Max")).toBeInTheDocument();
  });
});
export {};
