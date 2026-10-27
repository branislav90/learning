const socket = new WebSocket('wss://example.com/chat');

function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  useEffect(() => {
    socket.addEventListener('message', (e) => {
      const m = JSON.parse(e.data) as Msg;
      setMessages([...messages, m]);
    });
  }, []);
  return <ul>{messages.map((m) => <li key={m.id}>{m.text}</li>)}</ul>;
}
export {};
