// packages/platform/src/auth/permissions.ts
import type { Capability } from '../module-registry/define-module';

export interface PermissionSet { has(c: Capability): boolean; version: string }
export const createPermissions = (caps: readonly Capability[], version: string): PermissionSet => {
  const set = new Set(caps);
  return { has: (c) => set.has(c), version };
};
