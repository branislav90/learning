type State = { status: "idle" | "submitting" | "done" | "failed"; error?: string };
type Action = { type: "submit" } | { type: "succeeded" } | { type: "failed"; error: string };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "submit": return s.status === "submitting" ? s : { status: "submitting" };
    case "succeeded": return { status: "done" };
    case "failed": return { status: "failed", error: a.error };
  }
}
export {};
