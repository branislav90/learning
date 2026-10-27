function InvoiceBadge({ invoice }: { invoice: Invoice }) {
  const overdue = new Date() > invoice.dueDate;       // hard-wired clock
  useEffect(() => { analytics.track("invoice_badge_viewed"); }, []);   // hard-wired global
  return <span>{overdue ? "Overdue" : "OK"}</span>;
}
export {};
