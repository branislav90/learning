import { useState } from "react";

type Message = { id: string; subject: string };

function Row({ subject }: { subject: string }) {            // ✅ module scope: stable type
  const [expanded, setExpanded] = useState(false);
  return <li onClick={() => setExpanded(!expanded)}>{expanded ? `${subject} (open)` : subject}</li>;
}

export function Inbox({ messages }: { messages: Message[] }) {
  const [sortAsc, setSortAsc] = useState(true);
  const sorted = [...messages].sort((a, b) =>
    sortAsc ? a.subject.localeCompare(b.subject) : b.subject.localeCompare(a.subject));
  return (
    <>
      <button onClick={() => setSortAsc(!sortAsc)}>Sort</button>
      <ul>{sorted.map((m) => <Row key={m.id} subject={m.subject} />)}</ul>   {/* ✅ stable id */}
    </>
  );
}
