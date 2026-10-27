import { useEffect, useState } from "react";
export function Toggle({ enabled, id }: { enabled: boolean; id: string }) {
  if (!enabled) return null;
  const [on, setOn] = useState(false);
  useEffect(() => { console.log(id, on); }, []);
  fetch("/x");
  return <div onClick={() => setOn(!on)}><img src="a.png" /></div>;
}
const j = fetch("/y").then((r) => r.json());
void j;
