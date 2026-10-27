// BAD 1: promise created during render of a Client Component
function Profile({ id }: { id: number }) {
  const user = use(fetch(`/api/users/${id}`).then((r) => r.json()));   // new promise each render
  return <h2>{user.name}</h2>;
}

// BAD 2: one giant boundary at the root, no transitions
<Suspense fallback={<FullPageSpinner />}><App /></Suspense>
// every navigation/refetch replaces the entire app with a spinner

// BAD 3: Suspense without error boundary
<Suspense fallback={<Spinner />}><Profile id={id} /></Suspense>   // rejection → crashes up to the root

// BAD 4: sibling waterfall via separate render-time requests
function Dashboard() {
  const a = useSuspenseQuery(aOptions());
  const b = useSuspenseQuery(bOptions());   // b's request starts only after a resolves
  return <View a={a.data} b={b.data} />;
}

// BAD 5: swallowing the pending state with try/catch around use
try { const v = use(p); } catch { /* ... */ }     // do not catch around use
export {};
