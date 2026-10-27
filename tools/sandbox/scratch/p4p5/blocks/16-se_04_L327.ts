// ordersSlice.ts (Redux Toolkit style)
const ordersSlice = createSlice({
  name: "orders",
  initialState: { items: [] as Order[], loading: false, error: null as string | null },
  reducers: { /* setLoading, setItems, setError, updateItem... */ },
});
// plus thunks: fetchOrders, saveOrder, ...
export {};
