import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: (args: { error: Error; reset: () => void }) => ReactNode;
  resetKeys?: unknown[];                     // when these change, try again
}
interface State { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error): State { return { error }; }
  componentDidUpdate(prev: Props) {
    if (this.state.error && !shallowEqualArrays(prev.resetKeys, this.props.resetKeys)) {
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
function shallowEqualArrays(a: unknown[] = [], b: unknown[] = []) {
  return a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
}
