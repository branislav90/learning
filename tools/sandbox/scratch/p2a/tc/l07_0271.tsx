import { useEffect, useState } from "react";

type Contact = { id: string; name: string; email: string };

// ❌ Effect-based reset
function EditorWithEffect({ contact }: { contact: Contact }) {
  const [name, setName] = useState(contact.name);
  const [email, setEmail] = useState(contact.email);
  useEffect(() => { setName(contact.name); setEmail(contact.email); }, [contact]);  // runs AFTER paint
  return <Form name={name} email={email} onName={setName} onEmail={setEmail} />;
}

// ✅ Key-based reset
function EditorWithKey({ contact }: { contact: Contact }) {
  const [name, setName] = useState(contact.name);       // initial value only
  const [email, setEmail] = useState(contact.email);
  return <Form name={name} email={email} onName={setName} onEmail={setEmail} />;
}
export function ContactPage({ contact }: { contact: Contact }) {
  return <EditorWithKey key={contact.id} contact={contact} />;
}
