// src/app/components/RegionBoundary.tsx
import { Component, Suspense, type ReactNode } from 'react';

interface Props { fallback: ReactNode; errorFallback: ReactNode; children: ReactNode }

class Catcher extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
// A class is still required for error boundaries in React 19 (no hook equivalent);
// react-error-boundary is the common library alternative.

export function RegionBoundary({ fallback, errorFallback, children }: Props) {
  return (
    <Catcher fallback={errorFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </Catcher>
  );
}
