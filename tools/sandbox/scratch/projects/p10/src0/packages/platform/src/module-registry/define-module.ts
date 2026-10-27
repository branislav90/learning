// packages/platform/src/module-registry/define-module.ts
import type { ComponentType, LazyExoticComponent } from 'react';
import type { RouteObject } from 'react-router';

export type Capability = `${string}:${string}`;           // e.g. 'workorder:assign'

export interface NavEntry {
  id: string;
  labelKey: string;                                       // i18n message id, never a raw string
  to: string;
  icon: string;
  requires?: Capability;
  flag?: string;
}

export interface CommandEntry {
  id: string;
  labelKey: string;
  requires?: Capability;
  run: (ctx: { navigate: (to: string) => void }) => void;
}

export interface FleetModule {
  id: string;
  /** Lazily loaded; the shell never imports module internals statically. */
  routes: () => Promise<RouteObject[]>;
  nav: NavEntry[];
  commands?: CommandEntry[];
  widgets?: Array<{ id: string; slot: 'dashboard'; component: LazyExoticComponent<ComponentType> }>;
  /** Called on tenant switch; the module must drop ALL tenant-scoped client state. */
  resetTenantState?: () => void;
}

export function defineModule<M extends FleetModule>(m: M): M { return m; }
