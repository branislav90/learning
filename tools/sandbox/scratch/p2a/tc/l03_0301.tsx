import { useEffect, useState } from "react";

export function Dashboard({ userId }: { userId: string }) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    fetch(`/api/dashboard/${userId}`)
      .then((r) => r.json())
      .then((d: Data) => setData(d));
  }, [userId]);

  return data ? <View data={data} /> : <Spinner />;
}
