import { createContext, use, useId, type ReactNode, type ComponentProps } from 'react';

type TabsContextValue = {
  baseId: string;
  value: string;
  setValue: (v: string) => void;
};
const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string): TabsContextValue {
  const ctx = use(TabsContext);                       // React 19: `use` can read context
  if (!ctx) throw new Error(`<${component}> must be rendered inside <Tabs>`);
  return ctx;
}

export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  external: ((e: E) => void) | undefined,
  internal: (e: E) => void,
) {
  return (e: E) => {
    external?.(e);
    if (!e.defaultPrevented) internal(e);
  };
}

type TabsProps = {
  value?: string;
  defaultValue: string;
  onValueChange?: (v: string) => void;
  children: ReactNode;
};

export function Tabs({ value, defaultValue, onValueChange, children }: TabsProps) {
  const [current, setValue] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const baseId = useId();
  return <TabsContext value={{ baseId, value: current, setValue }}>{children}</TabsContext>;
}

export function TabList(props: ComponentProps<'div'>) {
  return <div role="tablist" {...props} />;
}

type TabProps = Omit<ComponentProps<'button'>, 'value'> & { value: string };

export function Tab({ value, onClick, ...rest }: TabProps) {
  const { baseId, value: active, setValue } = useTabs('Tab');
  const selected = active === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      data-state={selected ? 'active' : 'inactive'}
      {...rest}
      onClick={composeEventHandlers(onClick, () => setValue(value))}
    />
  );
}

export function TabPanel({ value, ...rest }: ComponentProps<'div'> & { value: string }) {
  const { baseId, value: active } = useTabs('TabPanel');
  if (active !== value) return null;
  return <div role="tabpanel" id={`${baseId}-panel-${value}`} aria-labelledby={`${baseId}-tab-${value}`} {...rest} />;
}
export {};
