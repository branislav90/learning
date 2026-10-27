import { useState } from "react";

export function Profile({ user }: { user: { name: string } | null }) {
  const [tab, setTab] = useState<"info" | "posts">("info");
  // …
  return <button onClick={() => setTab("posts")}>{user?.name ?? "guest"} / {tab}</button>;
}
