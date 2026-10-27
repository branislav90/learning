import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { fallback: ReactNode; children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error: error instanceof Error ? error : new Error(String(error)) };  // normalize non-Errors
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    reportError(error, { componentStack: info.componentStack });   // side effects belong here (not in getDerivedStateFromError)
  }

  render() {
    return this.state.error ? this.props.fallback : this.props.children;
  }
}
export {};
