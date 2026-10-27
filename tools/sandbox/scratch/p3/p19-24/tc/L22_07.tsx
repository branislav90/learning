export {};
// Reconnects every time `theme` changes, even though the connection doesn't depend on the theme
useEffect(() => {
  const conn = createConnection(roomId);
  conn.on('connected', () => showToast('Connected', theme));
  conn.connect();
  return () => conn.disconnect();
}, [roomId, theme]); // theme in deps -> reconnect on theme change
