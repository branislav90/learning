function Toolbar() {
  const [online, setOnline] = useState(navigator.onLine);
  const [dark, setDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'system');

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  useEffect(() => {
    const m = window.matchMedia('(prefers-color-scheme: dark)');
    const h = (e: MediaQueryListEvent) => setDark(e.matches);
    m.addEventListener('change', h);
    return () => m.removeEventListener('change', h);
  }, []);

  useEffect(() => {
    const h = (e: StorageEvent) => { if (e.key === 'theme') setTheme(e.newValue ?? 'system'); };
    window.addEventListener('storage', h);
    return () => window.removeEventListener('storage', h);
  }, []);

  function chooseTheme(t: string) { localStorage.setItem('theme', t); setTheme(t); }  // storage event does NOT fire here
  ...
}
export {};
