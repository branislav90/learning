case "orderPlaced": {
  localStorage.setItem("lastOrder", JSON.stringify(action.order));  // ❌ side effect
  return { ...state, id: crypto.randomUUID(), placedAt: Date.now(), order: action.order };   // ❌ non-deterministic
}
export {};
