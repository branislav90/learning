function Badge({ user }: { user: { role: string; lastSeen: string } }) {
  const online = Date.now() - new Date(user.lastSeen).getTime() < 5 * 60_000;
  return <span className={user.role === "admin" ? "b-admin" : "b"}>{online ? "●" : "○"}</span>;
}
export {};
