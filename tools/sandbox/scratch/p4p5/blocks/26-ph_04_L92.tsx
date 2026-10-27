const profilePromise = fetch("/api/me").then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.json() as Promise<{ name: string }>; });

function Profile() {
  const me = use(profilePromise);
  return <p>{me.name}</p>;
}

<ErrorBoundary fallback={<p>E</p>}>
  <Suspense fallback={<p>L</p>}>
    <Profile />
  </Suspense>
</ErrorBoundary>
export {};
