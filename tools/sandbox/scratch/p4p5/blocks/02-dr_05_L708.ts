type Role = "admin" | "support" | "member";
export function canEdit(u: Pick<User, "id" | "role">, d: Pick<Doc, "ownerId">): boolean {
  return u.role === "admin" || u.id === d.ownerId;
}
export function canEditAsSupport(u: Pick<User, "id" | "role">, d: Pick<Doc, "ownerId">): boolean {
  return canEdit(u, d) || u.role === "support";
}
export {};
