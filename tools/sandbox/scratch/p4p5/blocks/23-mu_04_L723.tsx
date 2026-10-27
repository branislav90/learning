import type { ComponentType } from "react";

export interface WidgetDefinition {
  id: string;
  title: string;
  owner: string;
  component: ComponentType;
}

export function createWidgetRegistry() {
  const widgets = new Map<string, WidgetDefinition>();
  return {
    register(def: WidgetDefinition): void {
      if (widgets.has(def.id)) throw new Error(`Widget id "${def.id}" is already registered by ${widgets.get(def.id)!.owner}`);
      widgets.set(def.id, def);
    },
    list: (): readonly WidgetDefinition[] => [...widgets.values()],
  };
}
export {};
