function OrdersPage() {
  const vm = useOrdersPage();          // data, derived data, handlers (the "container logic")
  return <OrdersView {...vm} />;       // markup (the "presentational" part)
}
export {};
