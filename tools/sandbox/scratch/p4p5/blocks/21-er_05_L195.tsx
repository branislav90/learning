import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  fallback: (args: { error: unknown; reset: () => void }) => ReactNode;
  onError?: (error: unknown, info: ErrorInfo) => void;
  children: ReactNode;
};
type State = { error: unknown; hasError: boolean };

export class Boundary extends Component<Props, State> {
  state: State = { error: null, hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { error, hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  reset = () => this.setState({ error: null, hasError: false });

  render() {
    if (this.state.hasError) {
      return this.props.fallback({ error: this.state.error, reset: this.reset });
    }
    return this.props.children;
  }
}
export {};
