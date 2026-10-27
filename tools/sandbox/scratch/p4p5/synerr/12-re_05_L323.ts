case "itemAdded": {
  state.items.push({ ...action.item, quantity: 1 });   // ❌ mutates the previous state
  return state;                                        // ❌ same reference: React bails out → UI doesn't update
}
export {};
