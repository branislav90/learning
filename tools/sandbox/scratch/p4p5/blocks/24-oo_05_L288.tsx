type Conn =
  | { status: "idle" }
  | { status: "connecting"; attempt: number }
  | { status: "open"; socketId: string }
  | { status: "failed"; reason: string };

type ConnEvent =
  | { type: "CONNECT" }
  | { type: "OPENED"; socketId: string }
  | { type: "FAIL"; reason: string }
  | { type: "CLOSE" };

function transition(s: Conn, e: ConnEvent): Conn {
  switch (s.status) {
    case "idle":
      return e.type === "CONNECT" ? { status: "connecting", attempt: 1 } : s;
    case "connecting":
      if (e.type === "OPENED") return { status: "open", socketId: e.socketId };
      if (e.type === "FAIL") return s.attempt < 3
        ? { status: "connecting", attempt: s.attempt + 1 }
        : { status: "failed", reason: e.reason };
      return s;
    case "open":
      return e.type === "CLOSE" ? { status: "idle" } : s;
    case "failed":
      return e.type === "CONNECT" ? { status: "connecting", attempt: 1 } : s;
  }
}
export {};
