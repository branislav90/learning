type Profile = { avatar: string; first: string; last: string };
type ProfileState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; profile: Profile };

function useProfile(id: string) {
  const [state, setState] = useState<ProfileState>({ status: "loading" });
  const [followError, setFollowError] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ status: "loading" });
    fetch(`/api/p/${encodeURIComponent(id)}`, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json() as Promise<Profile>; })
      .then((profile) => setState({ status: "ready", profile }))
      .catch(() => { if (!ctrl.signal.aborted) setState({ status: "error" }); });
    return () => ctrl.abort();
  }, [id]);

  const follow = useCallback(async () => {
    setFollowError(false);
    try {
      const r = await fetch(`/api/p/${encodeURIComponent(id)}/follow`, { method: "POST" });
      if (!r.ok) throw new Error(String(r.status));
    } catch { setFollowError(true); }
  }, [id]);

  return { state, follow, followError } as const;
}

function ProfileView({ state, onFollow, followError }: { state: ProfileState; onFollow(): void; followError: boolean }) {
  if (state.status === "loading") return <p aria-busy="true">Loading…</p>;
  if (state.status === "error") return <p role="alert">Could not load profile.</p>;
  const { avatar, first, last } = state.profile;
  return (
    <div>
      <img src={avatar} alt="" width={64} height={64} />
      <h1>{first} {last}</h1>
      <button onClick={onFollow}>Follow</button>
      {followError && <p role="alert">Could not follow. Try again.</p>}
    </div>
  );
}

export function ProfilePage({ id }: { id: string }) {
  const { state, follow, followError } = useProfile(id);
  return <ProfileView state={state} onFollow={follow} followError={followError} />;
}
export {};
