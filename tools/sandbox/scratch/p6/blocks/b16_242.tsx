// ❌ Misses lie-fi, captive portals, and API-only outages; blocks the user when onLine is wrong
async function save(data: Note) {
  if (!navigator.onLine) {
    alert('You are offline');
    return;
  }
  await fetch('/api/notes', { method: 'POST', body: JSON.stringify(data) });
}
export {};
