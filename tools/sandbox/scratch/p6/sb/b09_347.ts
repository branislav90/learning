// store/listeners.ts
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { lineAdded, qtyChanged, saveDraft } from './draftSlice';

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(lineAdded, qtyChanged),
  effect: async (_action, api) => {
    api.cancelActiveListeners();              // restart the debounce on each edit
    await api.delay(1500);                    // cancelled if a newer edit arrives
    api.dispatch(saveDraft());                // autosave after 1.5 s quiet
  },
});
export {};
