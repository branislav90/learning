const selectExpensive = createSelector(
  [(s: RootState) => s.cart.items],
  items => items.filter(i => i.price > 1000),
);
const expensive = useAppSelector(selectExpensive);   // stable until cart.items changes

reducers: { reset: () => ({ items: [] }) }           // or state.items = []
dispatch(opened({ at: Date.now() }));
export {};
