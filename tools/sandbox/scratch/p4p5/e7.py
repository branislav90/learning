import sys; sys.path.insert(0,'/tmp')
from rep import rep
B='/Users/todorbra/Projects/ReactLearning/react-mastery/04-react-architecture/'
f=B+'19-error-boundaries.md'
rep(f,"in React 19 the root's `onCaughtError` is also invoked (ensure","in React 19 the root's `onCaughtError` is also invoked (measured in React 19.3.1 + jsdom on a first mount: the throwing child executed several times because React retries the render, then `getDerivedStateFromError`, the fallback render, `onCaughtError`, and *then* `componentDidCatch`; do not rely on the relative order or the retry count; ensure")
rep(f,"⚠ Option names and the shape of `info` are React 19 specifics; verify at the `createRoot` reference.","Option names are React 19 `createRoot`/`hydrateRoot` options (verified against react.dev/reference/react-dom/client/createRoot, 2026-10-22); each callback receives `(error, errorInfo)` with `errorInfo.componentStack`.")
rep(f,"Verify exact names and signatures in react.dev's `createRoot` reference.","Names and signatures verified against react.dev's `createRoot` reference (2026-10-22).")
