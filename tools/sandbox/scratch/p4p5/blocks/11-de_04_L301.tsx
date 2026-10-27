const AppContext = createContext<any>(null);

function InvoiceBadge({ invoice }: { invoice: Invoice }) {
  const app = useContext(AppContext);
  app.analytics.track("viewed");                       // side effect in render
  const overdue = app.utils.isOverdue(invoice, app.clock.now());
  return <span>{overdue ? app.i18n.t("overdue") : "OK"}</span>;
}
export {};
