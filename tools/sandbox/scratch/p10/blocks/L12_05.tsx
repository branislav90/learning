// Works on React 18.3 and 19: forwardRef is supported in both (⚠ verify deprecation status in current React docs).
import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react';

type InputProps = ComponentPropsWithoutRef<'input'> & { label: string };

export const TextField = forwardRef<HTMLInputElement, InputProps>(function TextField(
  { label, id, ...rest },
  ref
) {
  const autoId = useId();                  // useId exists in React 18+
  const inputId = id ?? autoId;
  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} ref={ref} {...rest} />
    </div>
  );
});
