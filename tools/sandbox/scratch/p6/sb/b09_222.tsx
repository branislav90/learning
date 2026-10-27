// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { cartSlice } from './cartSlice';

export const store = configureStore({
  reducer: { [cartSlice.reducerPath]: cartSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export {};
