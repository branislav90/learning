import { StrictMode } from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, it, expect } from "vitest";
import { FormProvider } from "../form/FormProvider";
import { ApiProvider } from "../api/ApiContext";
import { CompanyStep } from "../ui/steps/CompanyStep";
import { createControllableApi } from "./fakeApi";

it("out-of-order registration checks: latest value wins; first request aborted", async () => {
  vi.useFakeTimers();
  const user = userEvent.setup({ delay: null });
  const { api, checks } = createControllableApi();
  render(<StrictMode><ApiProvider api={api}><FormProvider><CompanyStep /></FormProvider></ApiProvider></StrictMode>);
  const input = screen.getByLabelText(/registration number/i);
  await user.type(input, "ABC123");
  await act(async () => { await vi.advanceTimersByTimeAsync(450); });
  console.log("checks after first pause (StrictMode):", checks.map((c) => c.value));
  await user.type(input, "4");
  await act(async () => { await vi.advanceTimersByTimeAsync(450); });
  console.log("checks:", checks.map((c) => [c.value, c.signal.aborted]));
  const [a, b] = [checks[0]!, checks[1]!];
  expect(a.signal.aborted).toBe(true);
  await act(async () => { b.result.resolve(true); });
  await act(async () => { a.result.resolve(false); });
  expect(screen.getByText(/is available/i)).toBeInTheDocument();
  expect(screen.queryByText(/already registered/i)).not.toBeInTheDocument();
  vi.useRealTimers();
});
