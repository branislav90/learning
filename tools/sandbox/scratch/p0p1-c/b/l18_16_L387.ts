export {};
function loadUser(): User | null {
  const raw = localStorage.getItem("user");
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isUser(parsed) ? parsed : null;
  } catch {
    return null;                       // malformed JSON
  }
}
