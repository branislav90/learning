// View: data in, markup out
export function UserBadgeView({ name }: { name: string | null }) {
  return <span className="badge">{name ?? "…"}</span>;
}

// Behaviour: data + analytics as effects, not render side effects
function useUserName(userId: string): string | null {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    setName(null);
    fetch(`/api/users/${userId}`, { signal: ctrl.signal })
      .then((r) => r.json() as Promise<{ name: string }>)
      .then((u) => setName(u.name))
      .catch(() => { /* aborted or failed: leave placeholder; surface errors as your app requires */ });
    return () => ctrl.abort();
  }, [userId]);
  return name;
}

export function UserBadge({ userId }: { userId: string }) {
  const name = useUserName(userId);
  const analytics = useAnalytics(); // injection seam from Lesson 01
  useEffect(() => { analytics.track("badge_view"); }, [analytics]);
  return <UserBadgeView name={name} />;
}
export {};
