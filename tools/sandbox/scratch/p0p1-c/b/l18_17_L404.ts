export {};
type Loading = { status: "loading" };
type Failure = { status: "error"; error: Error };
type Success<T> = { status: "success"; data: T };
type Remote<T> = Loading | Failure | Success<T>;

function isSuccess<T>(r: Remote<T>): r is Success<T> {
  return r.status === "success";
}

function assertNever(x: never): never {
  throw new Error(`Unhandled variant: ${JSON.stringify(x)}`);
}

function render(r: Remote<string[]>): string {
  switch (r.status) {
    case "loading": return "Loading…";
    case "error":   return `Failed: ${r.error.message}`;
    case "success": return r.data.join(", ");
    default:        return assertNever(r);   // compile-time exhaustiveness + runtime safety net
  }
}

function assertDefined<T>(v: T | null | undefined, msg: string): asserts v is T {
  if (v == null) throw new Error(msg);       // == null matches null and undefined
}
