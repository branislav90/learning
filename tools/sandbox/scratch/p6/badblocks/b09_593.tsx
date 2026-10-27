reducers: { added(state, a: PayloadAction<Item>) { state.items.push(a.payload); return state; } }
export {};
