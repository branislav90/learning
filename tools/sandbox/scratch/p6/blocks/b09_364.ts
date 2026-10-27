// store.ts (excerpt)
export const store = configureStore({
  reducer: { draft: draftSlice.reducer /* ... */ },
  middleware: getDefault => getDefault().prepend(listenerMiddleware.middleware),
});
export {};
