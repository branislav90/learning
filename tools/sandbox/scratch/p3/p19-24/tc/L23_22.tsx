export {};
// 🔴 pays comparison + closure allocation, benefits nothing
const onClick = useCallback(() => setOpen(true), []); // passed to a plain <button>
