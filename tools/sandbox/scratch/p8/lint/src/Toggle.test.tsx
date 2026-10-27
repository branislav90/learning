import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { Toggle } from "./Toggle";
test("x", async () => {
  const { container } = render(<Toggle enabled id="a" />);
  expect(container.querySelector(".x")).toBeNull();
  const el = await screen.getByText("x");
  expect(el).toBeTruthy();
});
