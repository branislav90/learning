import { useEffect, useEffectEvent } from 'react'; // stable since React 19.2

function ChatRoom({ roomId, theme }: { roomId: string; theme: 'light' | 'dark' }) {
  const onConnected = useEffectEvent(() => {
    showToast(`Connected to ${roomId}`, theme); // reads latest roomId and theme
  });

  useEffect(() => {
    const conn = createConnection(roomId);
    conn.on('connected', onConnected);
    conn.connect();
    return () => conn.disconnect();
  }, [roomId]); // `roomId` because the connection depends on it; onConnected excluded
  // ...
}
