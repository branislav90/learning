import { create } from 'zustand';

interface SelState {
  selected: Record<string, true>;
  toggle: (id: string) => void;
  clear: () => void;
  selectAll: (ids: string[]) => void;
}
export const useSelection = create<SelState>()((set) => ({
  selected: {},
  toggle: (id) => set((s) => {
    const next = { ...s.selected };
    if (next[id]) delete next[id]; else next[id] = true;
    return { selected: next };
  }),
  clear: () => set({ selected: {} }),
  selectAll: (ids) => set({ selected: Object.fromEntries(ids.map((i) => [i, true as const])) }),
}));

export const useIsSelected = (id: string) => useSelection((s) => s.selected[id] === true);
export {};
