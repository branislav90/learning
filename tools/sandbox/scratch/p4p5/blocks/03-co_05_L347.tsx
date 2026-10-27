type PageProps = {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  aside?: React.ReactNode;
};

function Page({ header, children, footer, aside }: PageProps) {
  return (
    <div className="page">
      <header>{header}</header>
      <div className="page__main">
        <main>{children}</main>
        {aside && <aside>{aside}</aside>}
      </div>
      {footer && <footer>{footer}</footer>}
    </div>
  );
}

function OrdersPage() {
  return (
    <Page header={<h1>Orders</h1>} aside={<OrderFilters />}>
      <OrdersTable />
    </Page>
  );
}
export {};
