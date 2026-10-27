import { useEffect, useState } from "react";

type Status = "connecting" | "open" | "closed";

export function useWebSocketStatus(url: string): Status {
  const [status, setStatus] = useState<Status>("connecting");

  useEffect(() => {
    setStatus("connecting");                    // synchronize *state* with the new connection attempt
    const ws = new WebSocket(url);
    ws.onopen = () => setStatus("open");
    ws.onclose = () => setStatus("closed");
    return () => {
      ws.onopen = null;
      ws.onclose = null;                         // avoid setState from a discarded connection
      ws.close();
    };
  }, [url]);

  return status;
}
