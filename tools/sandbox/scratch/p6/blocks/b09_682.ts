listenerMiddleware.startListening({
  actionCreator: userLoggedOut,
  effect: (_a, api) => {
    api.dispatch(ordersApi.util.resetApiState());
    api.dispatch(cartSlice.actions.cleared());
  },
});
export {};
