// Section.tsx
import { Component, Suspense, use, type ReactNode } from 'react';
import { createKeyedCache } from './keyed-cache';

const users = createKeyedCache<string, { name: string }>((id) =>
  fetch(`/api/users/${id}`).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json() as Promise<{ name: string }>;
  }),
);

interface BoundaryProps { onReset: () => void; children: ReactNode }
interface BoundaryState { error: Error | null }

class Boundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { error: null };
  static getDerivedStateFromError(error: Error): BoundaryState { return { error }; }
  retry = () => { this.props.onReset(); this.setState({ error: null }); };
  render() {
    return this.state.error ? (
      <div role="alert">
        Failed: {this.state.error.message} <button onClick={this.retry}>Retry</button>
      </div>
    ) : this.props.children;
  }
}

function User({ id }: { id: string }) {
  const user = use(users.get(id));
  return <h2>{user.name}</h2>;
}

export function Section({ id }: { id: string }) {
  return (
    <Boundary onReset={() => users.invalidate(id)}>
      <Suspense fallback={<p>Loading…</p>}>
        <User id={id} />
      </Suspense>
    </Boundary>
  );
}
