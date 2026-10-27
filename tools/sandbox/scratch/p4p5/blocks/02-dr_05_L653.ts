const canEditA = (u: User, d: Doc) => u.role === "admin" || d.ownerId === u.id;
const canEditB = (u: User, d: Doc) => u.role === "admin" || u.id === d.ownerId;
const canEditC = (u: User, d: Doc) => d.ownerId === u.id || u.role === "admin" || u.role === "support"; // intentional?
export {};
