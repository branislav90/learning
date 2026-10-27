import { useEffect, useState } from "react";

export function EffectKinds({ id }: { id: string }) {
  const [tick, setTick] = useState(0);

  useEffect(() => { console.log("A: every render"); });
  useEffect(() => { console.log("B: mount only"); }, []);
  useEffect(() => { console.log("C: when id changes", id); }, [id]);

  return <button onClick={() => setTick((t) => t + 1)}>tick {tick}</button>;
}
