// Over-engineered for a toggle
type Action = { type: "open" } | { type: "close" } | { type: "toggle" };
function reducer(open: boolean, a: Action): boolean {
  switch (a.type) { case "open": return true; case "close": return false; case "toggle": return !open; }
}
const [open, dispatch] = useReducer(reducer, false);
export {};
