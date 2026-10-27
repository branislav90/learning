import "@testing-library/jest-dom/vitest";
// jsdom's AbortSignal is not accepted by Node's (undici) Request, which React Router constructs for loaders.
const NodeRequest = globalThis.Request;
function PatchedRequest(this: unknown, input: RequestInfo | URL, init?: RequestInit) {
  try { return new NodeRequest(input, init); }
  catch (e) {
    if (!init?.signal) throw e;
    const { signal, ...rest } = init;
    const r = new NodeRequest(input, rest);
    signal.addEventListener("abort", () => {}, { once: true });
    return r;
  }
}
PatchedRequest.prototype = NodeRequest.prototype;
globalThis.Request = PatchedRequest as unknown as typeof Request;
