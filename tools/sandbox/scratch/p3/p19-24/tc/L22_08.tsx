export {};
const onConnected = useEffectEvent(() => showToast('Connected', theme));

useEffect(() => {
  const conn = createConnection(roomId);
  conn.on('connected', onConnected);
  conn.connect();
  return () => conn.disconnect();
}, [roomId]); // onConnected is NOT a dependency
