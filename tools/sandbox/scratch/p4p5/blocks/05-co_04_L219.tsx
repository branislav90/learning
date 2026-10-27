// features/orders/ui/OrderList.tsx — supplies domain knowledge
<DataList
  items={orders}
  getKey={(o) => o.id}
  renderItem={(o) => <OrderRow order={o} />}
  empty={<EmptyOrders />}
  header={<OrderFilters />}
/>
export {};
