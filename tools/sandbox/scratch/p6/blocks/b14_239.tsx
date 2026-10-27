// client.tsx
import { hydrateRoot } from 'react-dom/client';
import { App } from './App';

const initial = (window as unknown as { __INITIAL__: { orders: Order[] } }).__INITIAL__;
hydrateRoot(document.getElementById('root')!, <App initialOrders={initial.orders} />);
export {};
