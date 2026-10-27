function init(userId: string): CartState {
  const raw = localStorage.getItem(`cart:${userId}`);       // runs once on mount
  return raw ? (JSON.parse(raw) as CartState) : initialCart;  // ⚠ validate parsed data in real code
}
const [state, dispatch] = useReducer(cartReducer, userId, init);

useEffect(() => {
  localStorage.setItem(`cart:${userId}`, JSON.stringify(state));   // persistence is an effect
}, [userId, state]);
export {};
