// src/ui/fields/TextField.tsx
import type { ComponentProps } from "react";
import { fieldId } from "./fieldId";

interface TextFieldProps
  extends Omit<ComponentProps<"input">, "id" | "value" | "onChange" | "onBlur" | "aria-invalid" | "aria-describedby"> {
  path: string; // used to derive deterministic ids
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  error?: string; // already gated by the visibility policy
  hint?: string;
  required?: boolean;
  // `ref` is part of ComponentProps<"input"> in React 19: no forwardRef needed
}

export function TextField({
  path, label, value, onValueChange, onBlur, error, hint, required, ...inputProps
}: TextFieldProps) {
  const id = fieldId(path);
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? <span> (required)</span> : null}
      </label>
      {hint ? <p id={hintId} className="hint">{hint}</p> : null}
      <input
        {...inputProps} // includes `ref`
        id={id}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onBlur={onBlur}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      {error ? <p id={errorId} className="error">{error}</p> : null}
    </div>
  );
}
