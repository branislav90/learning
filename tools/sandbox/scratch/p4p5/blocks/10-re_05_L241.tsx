<List
  items={orders}
  getKey={(o) => o.id}
  renderItem={(o) => <OrderRow order={o} />}
  renderEmpty={() => <EmptyState title="No orders yet" />}
  aria-label="Recent orders"
/>
export {};
