// store/draftSlice.ts
import {
  createSlice, createEntityAdapter, createAsyncThunk, createSelector,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from './store';

export interface Line { id: string; sku: string; qty: number; unitPrice: number }

const linesAdapter = createEntityAdapter<Line>(); // default: selectId = entity.id

interface DraftState {
  lines: ReturnType<typeof linesAdapter.getInitialState>;
  saveStatus: 'idle' | 'saving' | 'saved' | 'failed';
  saveError?: string;
}

const initialState: DraftState = {
  lines: linesAdapter.getInitialState(),
  saveStatus: 'idle',
};

export const saveDraft = createAsyncThunk<
  { savedAt: string },                 // fulfilled payload
  void,                                // argument
  { state: RootState; rejectValue: string }
>('draft/save', async (_, { getState, signal, rejectWithValue }) => {
  const lines = linesAdapter.getSelectors((s: RootState) => s.draft.lines)
    .selectAll(getState());
  const res = await fetch('/api/drafts', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lines }),
    signal,
  });
  if (!res.ok) return rejectWithValue(`HTTP ${res.status}`);
  return (await res.json()) as { savedAt: string };
});

export const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {
    lineAdded: (s, a: PayloadAction<Line>) => { linesAdapter.addOne(s.lines, a.payload); },
    qtyChanged: (s, a: PayloadAction<{ id: string; qty: number }>) => {
      linesAdapter.updateOne(s.lines, { id: a.payload.id, changes: { qty: a.payload.qty } });
      if (s.saveStatus === 'saved') s.saveStatus = 'idle'; // edits invalidate "saved"
    },
  },
  extraReducers: builder => {
    builder
      .addCase(saveDraft.pending, s => { s.saveStatus = 'saving'; s.saveError = undefined; })
      .addCase(saveDraft.fulfilled, s => { s.saveStatus = 'saved'; })
      .addCase(saveDraft.rejected, (s, a) => {
        s.saveStatus = 'failed';
        s.saveError = a.payload ?? a.error.message;
      });
  },
});

export const { lineAdded, qtyChanged } = draftSlice.actions;

const lineSelectors = linesAdapter.getSelectors((s: RootState) => s.draft.lines);
export const selectLines = lineSelectors.selectAll;

export const selectTotal = createSelector([selectLines], lines =>
  lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0),
);
export {};
