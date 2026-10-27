import { useState } from "react";

function Field({ label }: { label: string }) {
  const [text, setText] = useState("");
  return <label>{label}<input value={text} onChange={(e) => setText(e.target.value)} /></label>;
}

export function Settings({ boxed }: { boxed: boolean }) {
  // ❌ Toggling `boxed` changes the type at this position (div ↔ fieldset)
  return boxed
    ? <fieldset><Field label="Name" /></fieldset>
    : <div><Field label="Name" /></div>;
}
