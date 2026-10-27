import { Component, useCallback, useState, type ErrorInfo, type ReactNode } from "react";

type FallbackArgs = { error: Error; reset: () => void };
type Props = {
  children: ReactNode;
  fallbackRender: (args: FallbackArgs) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  resetKeys?: readonly unknown[];
};
type State = { error: Error | null };

const toError = (e: unknown): Error => (e instanceof Error ? e : new Error(String(e)));
const keysChanged = (a: readonly unknown[] = [], b: readonly unknown[] = []) =>
  a.length !== b.length || a.some((v, i) => !Object.is(v, b[i]));

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error: toError(error) };            // pure: just record the error
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    this.props.onError?.(toError(error), info);  // side effect: reporting
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && keysChanged(prev.resetKeys, this.props.resetKeys)) this.reset();
  }

  reset = () => this.setState({ error: null });

  render() {
    return this.state.error
      ? this.props.fallbackRender({ error: this.state.error, reset: this.reset })
      : this.props.children;
  }
}

export function useErrorHandler() {
  const [, setState] = useState<void>();
  return useCallback((error: unknown) => {
    setState(() => { throw toError(error); });   // the updater runs during render → the boundary catches it
  }, []);
}
export {};
