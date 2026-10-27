function Orders() {
  const { data, error, isLoading } = useOrders();            // flags from some hook

  if (isLoading) return <Spinner />;                          // (1)
  if (error) return <ErrorPage />;                            // (2)
  if (!data.length) return <Spinner />;                       // (3)
  return <OrderTable rows={data} />;
}
export {};
