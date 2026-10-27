export const store = configureStore({
  reducer: { [ordersApi.reducerPath]: ordersApi.reducer },
  middleware: getDefault => getDefault().concat(ordersApi.middleware),
});
// optional, enables refetchOnFocus / refetchOnReconnect behaviours
setupListeners(store.dispatch);   // import from '@reduxjs/toolkit/query'
export {};
