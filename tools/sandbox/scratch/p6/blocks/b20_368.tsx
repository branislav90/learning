useEffect(() => {
  const onMessage = (e: MessageEvent<string>) => {
    const m = JSON.parse(e.data) as Msg;
    setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m])); // functional + dedupe by id
  };
  const unsubscribe = client.subscribe('chat:room-1', (ev) => onMessage(ev as unknown as MessageEvent<string>));
  return unsubscribe;
}, [client]);
export {};
