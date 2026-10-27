export {};
interface User { id: number; name: string; email?: string }

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isUser(v: unknown): v is User {
  return (
    isRecord(v) &&
    typeof v.id === "number" &&
    typeof v.name === "string" &&
    (v.email === undefined || typeof v.email === "string")
  );
}

async function fetchUser(id: number): Promise<User> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data: unknown = await res.json();    // res.json() returns Promise<any>; we re-type as unknown
  if (!isUser(data)) throw new Error("Unexpected user shape");
  return data;                                // narrowed to User
}
