import { useApp } from '../AppContext';

export function Header() {
  const { now, theme, setTheme } = useApp();
  return (
    <header className="header">
      <h1>Ticketdesk</h1>
      <div>
        <time dateTime={new Date(now).toISOString()}>{new Date(now).toLocaleTimeString()}</time>{' '}
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? 'Dark' : 'Light'} theme
        </button>
      </div>
    </header>
  );
}
