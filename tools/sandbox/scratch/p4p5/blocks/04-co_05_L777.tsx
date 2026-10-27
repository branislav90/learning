function OrdersPage() {
  const orders = useStore((s) => s.orders.items);
  const loading = useStore((s) => s.orders.loading);
  const dispatch = useDispatch();
  const onShip = useCallback((id: string) => dispatch(shipOrder(id)), [dispatch]);
  return <OrdersView orders={orders} loading={loading} onShip={onShip} />;
}
export {};
