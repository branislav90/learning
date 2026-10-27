// src/shared/ui/Field.tsx
import { useId, type ReactNode, type Ref, type InputHTMLAttributes } from "react";

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  hint?: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;   // React 19: ref is a regular prop for function components
}

export function Field({ label, hint, error, required, ref, ...inputProps }: FieldProps): ReactNode {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {hint && <p id={hintId} className="field__hint">{hint}</p>}
      <input
        {...inputProps}
        ref={ref}
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      {error && <p id={errorId} className="field__error">{error}</p>}
    </div>
  );
}
