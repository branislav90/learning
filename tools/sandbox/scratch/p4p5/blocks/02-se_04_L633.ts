type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; order: Order; totals: Totals };
export {};
