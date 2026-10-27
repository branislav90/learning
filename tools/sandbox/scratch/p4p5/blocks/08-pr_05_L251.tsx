const fake: ApiClient = {
  getOrders: async () => [{ id: "1", total: 10, status: "open" }],
  cancelOrder: async () => {},
};

render(
  <ApiClientProvider client={fake}>
    <OrdersPage />
  </ApiClientProvider>,
);
export {};
