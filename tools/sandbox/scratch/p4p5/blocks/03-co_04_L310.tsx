// pages/DashboardPage.tsx — page: composition and route-level concerns only
export function DashboardPage() {
  const [filter, setFilter] = useState<OrderFilter>("all"); // shared by filter bar and table
  return (
    <DashboardLayout header={<UserHeader />}>
      <OrderFilterBar value={filter} onChange={setFilter} />
      <OrderTable filter={filter} />
      <ToastHost />
    </DashboardLayout>
  );
}

// features/orders/ui/OrderTable.tsx — feature: owns data loading for its table
export function OrderTable({ filter }: { filter: OrderFilter }) {
  const { orders, status } = useOrders(filter);       // hook handles cancellation / caching
  const refund = useRefundDialog();                   // owns modal state + submit orchestration
  if (status === "loading") return <TableSkeleton />;
  return (
    <>
      <DataTable rows={orders} columns={orderColumns} onRowAction={(row) => refund.open(row)} />
      {refund.dialog}
    </>
  );
}
export {};
