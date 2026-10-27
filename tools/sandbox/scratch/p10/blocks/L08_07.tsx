import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";           // or jest-axe; vitest-axe needs `import * as matchers from "vitest-axe/matchers"; expect.extend(matchers)` in setup for toHaveNoViolations
import { Field } from "./Field";

it("associates label, hint and error", async () => {
  const { container } = render(<Field label="Email" hint="We never share it" error="Enter a valid email" />);
  const input = screen.getByLabelText("Email");
  expect(input).toHaveAccessibleDescription("We never share it Enter a valid email");
  expect(input).toBeInvalid();
  expect(await axe(container)).toHaveNoViolations();
});
