renamed(state, a: PayloadAction<{ id: string; name: string }>) { state.entities[a.payload.id].name = a.payload.name; }
export {};
