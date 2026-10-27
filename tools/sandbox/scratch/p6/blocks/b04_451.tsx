// State holds orders with nested customer copies
const [orders, setOrders] = useState<Order[]>([]);   // each order has { customer: { id, name } }

function renameCustomer(id: string, name: string) {
  setOrders(orders.map(o => o.customer.id === id ? { ...o, customer: { ...o.customer, name } } : o));
}
export {};
