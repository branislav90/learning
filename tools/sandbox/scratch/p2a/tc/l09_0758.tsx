import { type ReactNode, useState } from "react";

function Static() {
  console.count("Static render");
  return <p>I do not depend on the toggle.</p>;
}

function Toggle({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  return (
    <section>
      <button onClick={() => setOn(!on)}>{on ? "On" : "Off"}</button>
      {children}
    </section>
  );
}

export function Demo() {
  return (
    <Toggle>
      <Static />
    </Toggle>
  );
}
