import { useState } from "react";

export function Inbox({ messages }: { messages: { id: string; subject: string }[] }) {
  const [sortAsc, setSortAsc] = useState(true);
  const sorted = [...messages].sort((a, b) =>
    sortAsc ? a.subject.localeCompare(b.subject) : b.subject.localeCompare(a.subject));

  function Row({ subject }: { subject: string }) {            // ❌ new function identity each Inbox render
    const [expanded, setExpanded] = useState(false);
    return <li onClick={() => setExpanded(!expanded)}>{expanded ? `${subject} (open)` : subject}</li>;
  }

  return (
    <>
      <button onClick={() => setSortAsc(!sortAsc)}>Sort</button>
      <ul>{sorted.map((m, i) => <Row key={i} subject={m.subject} />)}</ul>   {/* ❌ index keys */}
    </>
  );
}
