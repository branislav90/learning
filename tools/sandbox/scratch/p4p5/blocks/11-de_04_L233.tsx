// InvoiceBadge.tsx
import { useEffect } from "react";
import { isOverdue, type Invoice } from "./invoice-rules";
import { useAnalytics, useClock } from "./services/ServicesContext";

export function InvoiceBadge({ invoice }: { invoice: Invoice }) {
  const clock = useClock();
  const analytics = useAnalytics();
  const overdue = isOverdue(invoice, clock.now());

  useEffect(() => {
    analytics.track("invoice_badge_viewed", { invoiceId: invoice.id, overdue });
  }, [analytics, invoice.id, overdue]);

  return <span data-state={overdue ? "overdue" : "ok"}>{overdue ? "Overdue" : "OK"}</span>;
}
export {};
