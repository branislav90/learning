function Toolbar() {
  const online = useOnlineStatus();                                 // 5.4
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)'); // 5.4
  const pref = useStore(themeStore, (t) => t);                       // 5.3
  const effective = pref === 'system' ? (prefersDark ? 'dark' : 'light') : pref;
  ...
}
export {};
