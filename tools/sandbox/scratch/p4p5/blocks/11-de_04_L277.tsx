// InvoiceBadge.test.tsx  (Vitest + React Testing Library)
import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { InvoiceBadge } from "./InvoiceBadge";
import { ServicesProvider } from "./services/ServicesContext";

it("shows Overdue and tracks once per distinct state", () => {
  const track = vi.fn();
  const services = { clock: { now: () => new Date("2025-03-10T00:00:00Z") }, analytics: { track } };
  render(
    <ServicesProvider value={services}>
      <InvoiceBadge invoice={{ id: "i1", dueDate: new Date("2025-03-01T00:00:00Z"), paid: false }} />
    </ServicesProvider>,
  );
  expect(screen.getByText("Overdue")).toBeInTheDocument();
  expect(track).toHaveBeenCalledWith("invoice_badge_viewed", { invoiceId: "i1", overdue: true });
});
export {};
