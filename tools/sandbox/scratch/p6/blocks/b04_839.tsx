let lastOrder: Order | undefined, lastCustomer: Customer | undefined, lastView: ReturnType<typeof selectOrderView>;
export function selectOrderViewMemo(orders: EntityTable<Order>, customers: EntityTable<Customer>, id: string) {
  const order = orders.byId[id];
  const customer = order ? customers.byId[order.customerId] : undefined;
  if (order === lastOrder && customer === lastCustomer) return lastView;
  lastOrder = order; lastCustomer = customer;
  return (lastView = order && { ...order, customer });
}
export {};
