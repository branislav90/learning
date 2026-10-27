import { createRoot, type Root } from "react-dom/client";

type Handlers = { onError?: (e: unknown) => void };

export function createWidget<P extends object>(
  container: HTMLElement,
  Component: React.ComponentType<P>,
  initial: P,
  { onError }: Handlers = {},
) {
  const root: Root = createRoot(container, {
    onUncaughtError: (e) => onError?.(e),      // React 19 option
    onRecoverableError: (e) => onError?.(e),
  });
  root.render(<Component {...initial} />);
  return {
    update(next: P) { root.render(<Component {...next} />); },   // update, same root: state preserved
    destroy() { root.unmount(); },
  };
}
