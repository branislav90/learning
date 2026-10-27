export class ContentTypeError extends Error { name = 'ContentTypeError'; }
// inside fetchJson after the ok check:
const ct = res.headers.get('content-type') ?? '';
if (!ct.includes('application/json')) throw new ContentTypeError(`Expected JSON, got "${ct}"`);
export {};
