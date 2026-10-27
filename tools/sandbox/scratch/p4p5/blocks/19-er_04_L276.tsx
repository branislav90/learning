type FallbackProps = { error: Error; reset: () => void };

type Props = {
  fallback: (p: FallbackProps) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
  /** When any value changes between renders while in error state, the boundary resets. */
  resetKeys?: readonly unknown[];
  children: ReactNode;
};
type State = { error: Error | null; prevKeys?: readonly unknown[] };

const changed = (a: readonly unknown[] = [], b: readonly unknown[] = []) =>
  a.length !== b.length || a.some((v, i) => !Object.is(v, b[i]));

export class Boundary extends Component<Props, State> {
  state: State = { error: null, prevKeys: this.props.resetKeys };

  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    // Reset automatically when the inputs that caused the failure change.
    if (state.error && changed(state.prevKeys, props.resetKeys)) {
      return { error: null, prevKeys: props.resetKeys };
    }
    return state.prevKeys !== props.resetKeys && !state.error ? { prevKeys: props.resetKeys } : null;
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    this.props.onError?.(error as Error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    return this.state.error
      ? this.props.fallback({ error: this.state.error, reset: this.reset })
      : this.props.children;
  }
}
export {};
