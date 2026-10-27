// store/cartSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem { productId: number; price: number; qty: number }
interface CartState { items: CartItem[] }
const initialState: CartState = { items: [] };

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    itemAdded(state, action: PayloadAction<{ productId: number; price: number }>) {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) existing.qty += 1;                 // "mutation" of a draft
      else state.items.push({ ...action.payload, qty: 1 });
    },
    itemRemoved(state, action: PayloadAction<number>) {
      state.items = state.items.filter(i => i.productId !== action.payload);
    },
    cleared: () => initialState,                        // return replaces state; no mutation
  },
  selectors: {
    selectCount: s => s.items.reduce((n, i) => n + i.qty, 0),
  },
});

export const { itemAdded, itemRemoved, cleared } = cartSlice.actions;
export {};
