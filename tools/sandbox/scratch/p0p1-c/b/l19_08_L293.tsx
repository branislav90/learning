export {};
import { useId, type ComponentPropsWithoutRef, type Ref } from "react";

interface TextFieldProps extends ComponentPropsWithoutRef<"input"> {
  label: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;      // React 19: ref is an ordinary prop on function components
}

export function TextField({ label, error, id, ref, ...rest }: TextFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        ref={ref}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        {...rest}
      />
      {error && <p id={errorId} role="alert">{error}</p>}
    </div>
  );
}
