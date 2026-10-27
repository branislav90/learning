// src/ui/ErrorSummary.tsx
import type { Ref } from "react";
import type { SummaryItem } from "../form/validation/steps";
import { fieldId } from "./fields/fieldId";

export function ErrorSummary({ items, ref }: { items: SummaryItem[]; ref?: Ref<HTMLDivElement> }) {
  if (items.length === 0) return null;
  return (
    <div ref={ref} tabIndex={-1} role="alert" className="error-summary" aria-labelledby="error-summary-title">
      <h2 id="error-summary-title">There {items.length === 1 ? "is 1 problem" : `are ${items.length} problems`}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.path}>
            <a
              href={`#${fieldId(item.path)}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(fieldId(item.path))?.focus();
              }}
            >
              {item.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
