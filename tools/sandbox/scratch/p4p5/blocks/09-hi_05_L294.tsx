// ✅ 1. Apply at module scope
const ResponsiveChart = withWindowSize(Chart);
function Page() { return <ResponsiveChart data={[1, 2]} />; }

// ✅ 2. Never mutate; wrap
function withBadge<P extends object>(Component: ComponentType<P>) {
  return function WithBadge(props: P) {
    return (<span className="badge-wrap"><Component {...props} /><Badge /></span>);
  };
}

// ✅ 3. Hoist statics deliberately, or design so statics are unnecessary
const TrackedSelect = Object.assign(withTracking(Select), { Option: Select.Option });
// Better: avoid wrapping compound roots; put tracking inside Select via a prop or context.

// ✅ 4. Namespace injected props; make collisions impossible
type Injected = { auth: { user: User; logout: () => void } };   // one key per HOC
export {};
