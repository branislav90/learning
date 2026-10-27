function InvoicePage() {
  return (
    <>
      <AppLayout.Header><h1>Invoices</h1></AppLayout.Header>
      <AppLayout.Sidebar><InvoiceFilters /></AppLayout.Sidebar>
      <InvoiceTable />
    </>
  );
}
// App: <AppLayout><InvoicePage /></AppLayout>
export {};
