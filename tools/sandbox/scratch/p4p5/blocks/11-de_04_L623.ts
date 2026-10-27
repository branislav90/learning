export function loadDraft(): Draft | null {
  const raw = localStorage.getItem("draft");
  return raw ? (JSON.parse(raw) as Draft) : null;
}
export {};
