// src/components/RouteErrorBoundary.tsx — class component: boundaries still require classes (React docs)
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode; fallback: (reset: () => void, error: Error) => ReactNode; resetKey?: unknown }
interface State { error: Error | null; prevResetKey: unknown }

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null, prevResetKey: this.props.resetKey };

  static getDerivedStateFromError(error: Error): Partial<State> { return { error }; }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    // reset when the key (e.g., route) changes, so navigating away recovers the UI
    if (props.resetKey !== state.prevResetKey) return { error: null, prevResetKey: props.resetKey };
    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // ⚠ With React 19 root callbacks, avoid double-reporting: choose ONE reporting place.
    console.error('Boundary caught', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    return this.state.error ? this.props.fallback(this.reset, this.state.error) : this.props.children;
  }
}
