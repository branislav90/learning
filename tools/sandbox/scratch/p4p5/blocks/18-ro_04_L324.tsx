function OrdersLayout() {
  const { data: user } = useUser();                  // request 1
  if (!user) return <Spinner />;
  return <Outlet />;
}
function OrderDetail() {
  const { orderId } = useParams();
  const { data: user } = useUser();                  // cached from the layout: no new request
  const { data: order } = useOrder(orderId!);        // request 2 starts only after request 1 resolved and children mounted
  const { data: items } = useOrderItems(orderId!);   // request 3: starts with request 2 (in parallel), but only after request 1 resolved
  if (!order) return <Spinner />;
  if (user?.role !== "admin") return <p>Forbidden</p>;   // “security”
  /* ... */
}
export {};
