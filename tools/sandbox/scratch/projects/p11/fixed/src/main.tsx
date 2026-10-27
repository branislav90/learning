import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { TicketsProvider } from './state/tickets';
import { ViewProvider } from './state/view';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TicketsProvider>
      <ViewProvider>
        <App />
      </ViewProvider>
    </TicketsProvider>
  </StrictMode>,
);
