// src/components/Controls/StatusTabs.tsx
import type { StatusFilter } from "../../types";

const TABS: ReadonlyArray<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "want", label: "Want to read" },
  { value: "reading", label: "Reading" },
  { value: "finished", label: "Finished" },
];

interface StatusTabsProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

export function StatusTabs({ value, onChange }: StatusTabsProps) {
  return (
    <div role="tablist" aria-label="Filter by status">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          type="button"
          aria-selected={tab.value === value}
          className={tab.value === value ? "tab tab--active" : "tab"}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
