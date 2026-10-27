// rating.tsx
import { useId } from "react";
import { useControllableState } from "./use-controllable-state";

type RatingProps = {
  value?: number | null;            // controlled; null = "no rating"
  defaultValue?: number | null;     // uncontrolled initial
  onValueChange?: (next: number | null) => void;
  max?: number;
  "aria-label"?: string;
};

export function Rating({ value, defaultValue = null, onValueChange, max = 5, ...rest }: RatingProps) {
  const [current, setCurrent] = useControllableState<number | null>({
    value, defaultValue, onChange: onValueChange,
  });
  const name = useId();

  return (
    <div role="radiogroup" {...rest}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <label key={n}>
          <input
            type="radio"
            name={name}
            value={n}
            checked={current === n}
            onChange={() => setCurrent(n)}
          />
          <span aria-hidden>{n <= (current ?? 0) ? "★" : "☆"}</span>
          <span className="visually-hidden">{n} of {max}</span>
        </label>
      ))}
    </div>
  );
}
export {};
