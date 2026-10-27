function Inbox({ messages }: { messages: Message[] }) {
  const [filter, setFilter] = useState("");          // unrelated to the list's output
  return (
    <>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <List items={messages} getKey={(m) => m.id} renderItem={(m) => <MessageRow message={m} />} />
    </>
  );
}
export {};
