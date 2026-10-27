import { useState } from "react";

function Chart({ data }: { data: number[] }) { /* renders chart */ return <pre>{data.join(",")}</pre>; }

export function Report({ data }: { data: number[] }) {
  const [view, setView] = useState<React.ReactElement>(<Chart data={data} />);  // ❌ element frozen at mount

  return (
    <>
      <button onClick={() => setView(<p>other</p>)}>other</button>
      {view}
    </>
  );
}
