// OrdersPage.tsx
export function OrdersPage() {
  const search = useOrdersSearchParams();          // owner: URL
  const filterKey = JSON.stringify([search.status, search.from, search.to]);
  return (
    <SelectionProvider key={filterKey}>            {/* new filter → fresh owner instance */}
      <OrdersToolbar />
      <OrdersTable />
      <OrderDrawer orderId={search.order} />
    </SelectionProvider>
  );
}
export {};
