// BEFORE — legacy implicit sharing
import { Children, cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from "react";

type TabProps = { id: string; label: string; selected?: boolean; onSelect?: (id: string) => void };

function Tab({ id, label, selected, onSelect }: TabProps) {
  return (
    <button role="tab" aria-selected={selected} onClick={() => onSelect?.(id)}>
      {label}
    </button>
  );
}

function BrokenTabs({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string>("");
  return (
    <div role="tablist">
      {Children.map(children, (child) =>
        isValidElement<TabProps>(child)
          ? cloneElement(child as ReactElement<TabProps>, {
              selected: child.props.id === selected,
              onSelect: setSelected,
            })
          : child,
      )}
    </div>
  );
}
export {};
