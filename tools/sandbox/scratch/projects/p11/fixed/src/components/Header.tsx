import { Clock } from './Clock';
import { useSetView, useView } from '../state/view';

export function Header() {
  const { theme } = useView();
  const setView = useSetView();
  return (
    <header className="header">
      <h1>Ticketdesk</h1>
      <div>
        <Clock />{' '}
        <button onClick={() => setView({ theme: theme === 'light' ? 'dark' : 'light' })}>
          {theme === 'light' ? 'Dark' : 'Light'} theme
        </button>
      </div>
    </header>
  );
}
