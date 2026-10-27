export {};
// 🔴
const expensive = useStore(cartStore, (s) => s.items.filter((i) => i.qty > 1));
