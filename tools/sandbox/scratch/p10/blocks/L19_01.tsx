// src/main.tsx
import { createRoot } from 'react-dom/client';
import { reportError } from './monitoring/report';
import { App } from './App';

createRoot(document.getElementById('root')!, {
  // ⚠ React 19 options; verify names/semantics against current docs
  onUncaughtError: (error) => reportError(error, 'uncaught'),
  onCaughtError: (error) => reportError(error, 'caught'),
  onRecoverableError: (error) => reportError(error, 'recoverable'),
}).render(<App />);
