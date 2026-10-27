// src/components/Tabs/Tabs.tsx
import { createContext, use, useId, type ReactNode } from "react";
import { useControllableState } from "../../internal/useControllableState";

type TabsCtx = { value: string; setValue: (v: string) => void; baseId: string };
const Ctx = createContext<TabsCtx | null>(null);

function useTabs(part: string): TabsCtx {
  const ctx = use(Ctx);
  if (!ctx) throw new Error(`<Tabs.${part}> must be rendered inside <Tabs>`);
  return ctx;
}

export type TabsProps = {
  value?: string;
  defaultValue: string;
  onValueChange?: (v: string) => void;
  children: ReactNode;
};

export function Tabs({ value, defaultValue, onValueChange, children }: TabsProps) {
  const [current, setValue] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const baseId = useId();
  return <Ctx value={{ value: current, setValue, baseId }}>{children}</Ctx>;
}

Tabs.List = function TabsList({ children }: { children: ReactNode }) {
  return <div role="tablist">{children}</div>;
};

Tabs.Tab = function Tab({ value, children }: { value: string; children: ReactNode }) {
  const { value: current, setValue, baseId } = useTabs("Tab");
  const selected = current === value;
  return (
    <button
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      onClick={() => setValue(value)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ value, children }: { value: string; children: ReactNode }) {
  const { value: current, baseId } = useTabs("Panel");
  if (current !== value) return null;
  return (
    <div role="tabpanel" id={`${baseId}-panel-${value}`} aria-labelledby={`${baseId}-tab-${value}`}>
      {children}
    </div>
  );
};
export {};
