import { useShallow } from 'zustand/react/shallow';

const { lines, clear } = useCart(useShallow((s) => ({ lines: s.lines, clear: s.clear })));
// or simply two selectors:
const lines2 = useCart((s) => s.lines);
const clear2 = useCart((s) => s.clear);

// immutable update
add: (id) => set((s) => ({ lines: [...s.lines, { productId: id, unitPrice: 0, qty: 1 }] })),
export {};
