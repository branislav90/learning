import { createSlice, createSelector, nanoid, type PayloadAction } from '@reduxjs/toolkit';

interface Note { id: string; text: string; at: number; dismissed: boolean }

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [] as Note[],
  reducers: {
    added: {
      reducer: (s, a: PayloadAction<Note>) => { s.push(a.payload); },
      prepare: (text: string) => ({
        payload: { id: nanoid(), text, at: Date.now(), dismissed: false } as Note,
      }),
    },
    dismissed: (s, a: PayloadAction<string>) => {
      const n = s.find(x => x.id === a.payload);
      if (n) n.dismissed = true;
    },
  },
  selectors: { selectAll: s => s },
});

export const selectVisible = createSelector(
  [notificationsSlice.selectors.selectAll],
  all => all.filter(n => !n.dismissed).sort((a, b) => b.at - a.at),
);
export {};
