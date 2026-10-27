import { createRoot, type Root } from "react-dom/client";
import { flushSync } from "react-dom";

let widgetRoot: Root | null = null;

export function mountWidget(container: HTMLElement, props: WidgetProps): void {
  widgetRoot ??= createRoot(container, {
    onUncaughtError(error, info) {      // React 19 root option
      reportToMonitoring(error, info.componentStack);
    },
    onRecoverableError(error) {
      reportToMonitoring(error);
    },
  });
  widgetRoot.render(<Widget {...props} />);   // same root: this is an UPDATE of the existing tree
}

export function mountWidgetSync(container: HTMLElement, props: WidgetProps): void {
  flushSync(() => mountWidget(container, props));  // DOM is committed when flushSync returns
}

export function unmountWidget(): void {
  widgetRoot?.unmount();   // runs cleanups, removes DOM, discards state
  widgetRoot = null;
}
