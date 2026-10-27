import { Component, useState, type ErrorInfo, type ReactNode } from "react";

type FallbackArgs = { error: Error; reset: () => void };
type Props = {
  children: ReactNode;
  fallback: (a: FallbackArgs) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  resetKeys?: readonly unknown[];
};
type State = { error: Error | null };

const changed = (a: readonly unknown[] = [], b: readonly unknown[] = []) =>
  a.length !== b.length || a.some((x, i) => !Object.is(x, b[i]));

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State { return { error }; }

  componentDidCatch(error: Error, info: ErrorInfo) { this.props.onError?.(error, info); }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // Only reset if an error was ALREADY showing before this update; otherwise an update that
    // both changes keys and throws would clear the freshly captured error immediately.
    if (this.state.error !== null && prevState.error !== null && changed(prevProps.resetKeys, this.props.resetKeys)) {
      this.reset();
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    return this.state.error ? this.props.fallback({ error: this.state.error, reset: this.reset }) : this.props.children;
  }
}

export function useThrowToBoundary() {
  const [, setState] = useState();
  return (error: unknown) => {
    setState(() => { throw error instanceof Error ? error : new Error(String(error)); });
  };
}
export {};
