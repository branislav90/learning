import { createContext } from 'react';
import type { PermissionSet } from './permissions';
export const PermissionContext = createContext<PermissionSet>({ has: () => false, version: '0' });
