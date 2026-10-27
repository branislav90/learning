type View<T> =
  | { kind: 'loading' }
  | { kind: 'error'; error: Error; retry: () => void }
  | { kind: 'empty' }
  | { kind: 'ready'; data: T };

function assertNever(x: never): never {
  throw new Error(`Unhandled view: ${JSON.stringify(x)}`);
}

function Members({ view }: { view: View<Member[]> }) {
  switch (view.kind) {
    case 'loading': return <MembersSkeleton />;
    case 'error':   return <InlineError message="Couldn't load members." onRetry={view.retry} />;
    case 'empty':   return <p>No members yet. Invite someone to get started.</p>;
    case 'ready':   return <MemberList members={view.data} />;
    default:        return assertNever(view);
  }
}
export {};
