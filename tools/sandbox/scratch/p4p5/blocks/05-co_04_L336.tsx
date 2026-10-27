// tests: inject a fake without module mocking
render(
  <OrdersApiProvider api={{ list: async () => [fakeOrder], refund: vi.fn() }}>
    <OrderList />
  </OrdersApiProvider>,
);
export {};
