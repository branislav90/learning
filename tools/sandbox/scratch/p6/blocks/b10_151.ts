import { useShallow } from 'zustand/react/shallow';

const { a, b } = useStore(useShallow((s) => ({ a: s.a, b: s.b })));
const [x, y] = useStore(useShallow((s) => [s.x, s.y]));
export {};
