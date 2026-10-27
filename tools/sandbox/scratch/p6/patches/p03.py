from patchlib import apply
apply('03',[
("the `react-error-boundary` package is a widely used wrapper ⚠ *verify current API*)","the `react-error-boundary` package (v6 at time of checking) is a widely used wrapper offering `ErrorBoundary` with `fallback`/`fallbackRender`/`FallbackComponent`, `onError`, `onReset`, `resetKeys`, and a `useErrorBoundary()` hook returning `{ showBoundary, resetBoundary }`; checked against its published type definitions on 2026-10-22)"),
("for centralized reporting ⚠ *verify current names and signature in the `createRoot` reference*.","for centralized reporting. Per the react.dev `createRoot` reference, `onCaughtError(error, errorInfo)` and `onRecoverableError(error, errorInfo)` receive an `errorInfo` with `componentStack`; `onCaughtError` was executed in React 19.3 with an `ErrorBoundary` to confirm the signature."),
("by the `react-error-boundary` library as `useErrorBoundary`/`showBoundary` ⚠ verify)","by the `react-error-boundary` library as `useErrorBoundary()` / `showBoundary`)"),
("a class component is the *only* way to author a boundary in core React ⚠ *verify no function-component API has been added in the version you use*.","a class component is the *only* way to author a boundary in core React (still true in the React 19.3 reference; there is no function-component API)."),
("(query libraries expose reset helpers for this ⚠ verify, e.g. TanStack Query's error-reset utility)","(query libraries expose reset helpers for this, e.g. TanStack Query v5's `QueryErrorResetBoundary` / `useQueryErrorResetBoundary`, both exported by `@tanstack/react-query` 5.104)"),
])
apply('15',[
("- ⚠ **React 19 root callbacks:**","- **React 19 root callbacks:**"),
(" Verify option names in the current `createRoot` reference."," Option names confirmed against the react.dev `createRoot` reference and by running `onCaughtError` on React 19.3."),
])
