import { useEffect, useState } from "react";

export function Dashboard({ userId }: { userId: string }) {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setData(null);                               // optional: show spinner when id changes
    fetch(`/api/dashboard/${userId}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((d: Data) => setData(d))
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return; // expected on cleanup
        console.error(e);
      });
    return () => controller.abort();             // cleanup on id change and on unmount
  }, [userId]);

  return data ? <View data={data} /> : <Spinner />;
}
