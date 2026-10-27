// BAD 1: mutating state outside a reducer
const items = useAppSelector(s => s.cart.items);
items.sort((a, b) => a.price - b.price);   // mutates (frozen in dev: throws; in prod: silent corruption)

// BAD 2: selector that allocates
const expensive = useAppSelector(s => s.cart.items.filter(i => i.price > 1000));
// new array every store update → component re-renders on every dispatch anywhere

// BAD 3: returning and mutating
reducers: {
  reset(state) { state.items = []; return { items: [] }; }  // Immer throws
}

// BAD 4: non-serialisable state
dispatch(opened({ at: new Date(), el: document.body }));   // Date and DOM node in actions/state
export {};
