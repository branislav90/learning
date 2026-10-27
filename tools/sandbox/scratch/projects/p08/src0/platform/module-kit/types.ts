// platform/module-kit/types.ts
import type { ComponentType, LazyExoticComponent } from 'react'
import type { RouteObject } from 'react-router'

export type PermissionKey = `${string}:${'read' | 'write' | 'approve' | 'admin'}`

export interface NavItem {
  label: string
  to: string
  requires?: PermissionKey
  flag?: string
  order?: number
}

export interface ModuleManifest {
  id: string
  /** Routes are lazily loaded; the manifest itself must be cheap to import. */
  routes: () => RouteObject[]
  nav: NavItem[]
  /** Ports this module needs the composition root to provide. */
  requires?: readonly PortKey[]
  /** Ports this module can provide to others. */
  provides?: readonly PortKey[]
  /** Flag that, when false, disables the whole module. */
  killSwitchFlag?: string
}

declare const portBrand: unique symbol
export type PortKey<T = unknown> = string & { readonly [portBrand]?: T }

export const defineModule = <M extends ModuleManifest>(m: M) => m
