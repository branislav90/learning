type Action = { type: "toggled" };
const [{ open }, dispatch] = useReducer((s: { open: boolean }, a: Action) => ({ open: !s.open }), { open: false });
export {};
