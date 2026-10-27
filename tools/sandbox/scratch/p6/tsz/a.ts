import { create } from 'zustand';
interface S { n: number; m?: number; inc: () => void }
export const useS = create<S>()((set) => ({ n: 0, inc: () => set((s) => ({ n: s.n + 1 })) }));
useS.setState({ n: 1 }, true);            // expect error: replace needs full state
useS.setState({ n: 1, inc: () => {} }, true);
export const useNoCurry = create<S>((set) => ({ n: 0, inc: () => set({ n: 1 }) }));
export const useInfer = create((set: any) => ({ x: 1 }));
