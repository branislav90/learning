import { useState } from "react";

export function Disclosure({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false); // owner: this component. Nobody else cares.
  return (
    <section>
      <button aria-expanded={open} onClick={() => setOpen((o) => !o)}>{title}</button>
      {open && <div>{children}</div>}
    </section>
  );
}
export {};
