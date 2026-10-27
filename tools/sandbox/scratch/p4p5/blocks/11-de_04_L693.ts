export interface KeyValueStore { getItem(k: string): string | null }
export function makeLoadDraft(store: KeyValueStore) {
  return function loadDraft(): Draft | null {
    const raw = store.getItem("draft");
    if (!raw) return null;
    try { return JSON.parse(raw) as Draft; } catch { return null; }   // corrupt data policy: documented decision
  };
}
// test
it("returns null for corrupt data", () => {
  const load = makeLoadDraft({ getItem: () => "{oops" });
  expect(load()).toBeNull();
});
export {};
