import { produce } from "immer";    // third-party library: verify current API in its docs

const next = produce(state, (draft) => {
  const item = draft.items.find((i) => i.sku === action.sku);
  if (item) item.quantity = action.quantity;     // "mutation" of a draft; Immer produces an immutable result
});
export {};
