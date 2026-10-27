import { useEffect, useLayoutEffect } from "react";

export function Demo({ label }: { label: string }) {
  console.log(`${label}: render (invocation)`);

  useLayoutEffect(() => {
    console.log(`${label}: layout effect`);
    return () => console.log(`${label}: layout cleanup`);
  });

  useEffect(() => {
    console.log(`${label}: passive effect`);
    return () => console.log(`${label}: passive cleanup`);
  });

  return (
    <div ref={(node) => console.log(`${label}: ref ${node ? "attached" : "detached"}`)}>
      {label}
    </div>
  );
}

export function App() {
  return (<Demo label="parent" />);
}
