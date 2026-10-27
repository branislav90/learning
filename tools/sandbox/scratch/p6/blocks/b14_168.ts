// sequential: 100 ms + 120 ms
const user = await getUser(id);
const orders = await getOrders(id);

// parallel: ~120 ms
const [user, orders] = await Promise.all([getUser(id), getOrders(id)]);
export {};
