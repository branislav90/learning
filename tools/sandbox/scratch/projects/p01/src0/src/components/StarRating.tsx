// src/components/StarRating.tsx
import type { Rating } from "../types";

const STARS: readonly Rating[] = [1, 2, 3, 4, 5];

type StarRatingProps =
  | { value: Rating | undefined; readOnly: true; label: string }
  | {
      value: Rating | undefined;
      readOnly?: false;
      label: string;
      onChange: (rating: Rating | undefined) => void;
    };

export function StarRating(props: StarRatingProps) {
  const { value, label } = props;

  if (props.readOnly) {
    return (
      <span role="img" aria-label={value ? `${label}: ${value} out of 5` : `${label}: not rated`}>
        {STARS.map((n) => (value !== undefined && n <= value ? "★" : "☆"))}
      </span>
    );
  }

  const { onChange } = props;
  return (
    <div role="group" aria-label={label} className="stars">
      {STARS.map((n) => {
        const selected = value === n;
        return (
          <button
            key={n}
            type="button"
            aria-pressed={selected}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            // Clicking the current rating clears it: a deliberate, documented behavior.
            onClick={() => onChange(selected ? undefined : n)}
          >
            {value !== undefined && n <= value ? "★" : "☆"}
          </button>
        );
      })}
    </div>
  );
}
