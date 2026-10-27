// packages/platform/src/auth/can.tsx
import type { ReactNode } from 'react';
import { use } from 'react';
import { PermissionContext } from './context';
import type { Capability } from '../module-registry/define-module';

export function useCan(c: Capability): boolean { return use(PermissionContext).has(c); }

export function Can({ I, children, fallback = null }: { I: Capability; children: ReactNode; fallback?: ReactNode }) {
  return useCan(I) ? <>{children}</> : <>{fallback}</>;
}
