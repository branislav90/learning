case "checkoutCompleted": {
  window.location.href = "/thanks";
  analytics.track("purchase", { total: totalOf(state) });
  return { ...state, items: [], completedAt: Date.now() };
}
export {};
