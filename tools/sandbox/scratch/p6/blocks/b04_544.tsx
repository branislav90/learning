export interface ApiProblem { status: number; code?: string; title: string; detail?: string; fieldErrors?: Record<string, string[]> }

export function problemFrom(status: number, body: unknown): ApiProblem {
  if (typeof body === 'object' && body !== null) {
    const b = body as Record<string, unknown>;       // narrowing after typeof check
    return {
      status,
      code: typeof b.code === 'string' ? b.code : typeof b.type === 'string' ? b.type : undefined,
      title: typeof b.title === 'string' ? b.title : typeof b.message === 'string' ? b.message : `HTTP ${status}`,
      detail: typeof b.detail === 'string' ? b.detail : undefined,
      fieldErrors: isFieldErrors(b.errors) ? b.errors : undefined,
    };
  }
  return { status, title: `HTTP ${status}` };
}
declare function isFieldErrors(x: unknown): x is Record<string, string[]>;
export {};
