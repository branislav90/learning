import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  fallback: (args: { error: Error; reset: () => void }) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  resetKeys?: ReadonlyArray<unknown>;
  children: ReactNode;
}
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prev: Props) {
    // Auto-reset when the inputs that caused the error change (e.g. route param).
    if (
      this.state.error &&
      this.props.resetKeys?.some((k, i) => !Object.is(k, prev.resetKeys?.[i]))
    ) {
      this.setState({ error: null });
    }
  }

  reset = () => this.setState({ error: null });

  render() {
    return this.state.error
      ? this.props.fallback({ error: this.state.error, reset: this.reset })
      : this.props.children;
  }
}
export {};
