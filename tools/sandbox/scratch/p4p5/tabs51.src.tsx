// tabs.tsx
import {
  createContext, use, useCallback, useId, useMemo, useState,
  type ComponentProps, type KeyboardEvent, type ReactNode,
} from "react";

type TabsContextValue = {
  value: string;
  select: (next: string) => void;
  baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(part: string): TabsContextValue {
  const ctx = use(TabsContext);
  if (ctx === null) {
    throw new Error(`<${part}> must be rendered inside <Tabs>.`);
  }
  return ctx;
}

type TabsProps = {
  /** Controlled value. When provided, the component never keeps its own. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  children: ReactNode;
};

export function Tabs({ value: controlled, defaultValue = "", onValueChange, children }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;
  const baseId = useId();

  const select = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const ctx = useMemo(() => ({ value, select, baseId }), [value, select, baseId]);

  return (
    <TabsContext value={ctx}>
      <div>{children}</div>
    </TabsContext>
  );
}

export function TabsList({ onKeyDown: userOnKeyDown, ...rest }: ComponentProps<"div">) {
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    userOnKeyDown?.(e);
    if (e.defaultPrevented) return;
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    const step = e.key === "ArrowRight" ? 1 : tabs.length - 1;
    const next = tabs[(current + step) % tabs.length];
    e.preventDefault();
    next.focus();
    next.click(); // "automatic activation": focus selects
  }
  return <div role="tablist" {...rest} onKeyDown={onKeyDown} />;
}

export function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const tabs = useTabs("Tabs.Trigger");
  const selected = tabs.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${tabs.baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${tabs.baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      onClick={() => tabs.select(value)}
    >
      {children}
    </button>
  );
}

export function TabsPanel({ value, children }: { value: string; children: ReactNode }) {
  const tabs = useTabs("Tabs.Panel");
  if (tabs.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${tabs.baseId}-panel-${value}`}
      aria-labelledby={`${tabs.baseId}-tab-${value}`}
      tabIndex={0}
    >
      {children}
    </div>
  );
}

// Optional: dot-notation namespace.
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Panel = TabsPanel;
export {};
export function Settings() {
  return (
    <Tabs defaultValue="billing">
      <Tabs.List aria-label="Settings sections">
        <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="profile"><input aria-label="p" /></Tabs.Panel>
      <Tabs.Panel value="billing"><input aria-label="b" /></Tabs.Panel>
    </Tabs>
  );
}
