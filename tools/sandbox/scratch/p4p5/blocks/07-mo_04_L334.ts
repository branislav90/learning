// src/platform/module-system/types.ts
import type { ComponentType } from "react";

export interface AppRoute {
  readonly path: string;
  readonly load: () => Promise<{ default: ComponentType }>; // lazy entry
  readonly requires?: readonly Permission[];
}

export interface NavItem {
  readonly id: string;
  readonly label: string;
  readonly to: string;
  readonly order: number;
  readonly requires?: readonly Permission[];
}

export type Permission = string & { readonly __brand: "Permission" };

export interface AppModule {
  readonly id: string;
  readonly routes: readonly AppRoute[];
  readonly nav?: readonly NavItem[];
  /** Called once by the shell; must not render or perform side effects other than registration. */
  readonly register?: (ctx: ModuleContext) => void;
}

export interface ModuleContext {
  readonly extensions: ExtensionRegistry;
}

export interface ExtensionRegistry {
  contribute<T>(point: ExtensionPoint<T>, value: T): void;
  get<T>(point: ExtensionPoint<T>): readonly T[];
}

export interface ExtensionPoint<T> {
  readonly id: string;
  /** phantom field; carries T for type inference only */
  readonly _t?: T;
}
export {};
