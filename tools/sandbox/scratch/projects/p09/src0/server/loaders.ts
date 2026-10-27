import type { Route } from '../src/app/routes';
export async function loadRoute(_r: Route): Promise<{ status: number; critical: Record<string, unknown> }> { return { status: 200, critical: {} }; }
