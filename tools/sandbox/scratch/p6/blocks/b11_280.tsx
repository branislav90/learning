// (1) split by update frequency and memoise
<UserCtx value={user}>
  <ThemeCtx value={themeValue}>
    <CartProvider>{children}</CartProvider>
  </ThemeCtx>
</UserCtx>

// (2) high-frequency pointer: a store/ref + local subscription
const pointerStore = createStore({ x: 0, y: 0 });       // from 5.2, but per component tree if needed
// consumers: useStoreSelector(pointerStore, s => s.x)

// (3) strict context: null default + throwing hook (see 5.1)

// (4) per-request store created in a provider (see 10, 5.5)
export {};
