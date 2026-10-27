// INCORRECT: god facade that swallows errors and exposes internals
function useEverything() {
  const cart = useCart(); const user = useUser(); const prefs = usePrefs(); const pay = usePayment(); // ...
  const placeOrder = async () => { try { /* ... */ } catch { /* ignore */ } };   // swallowed
  return { ...cart, ...user, ...prefs, ...pay, placeOrder, rawPaymentSdk: pay.sdk };  // spread everything + leak
}
export {};
