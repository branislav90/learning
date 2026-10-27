import { useId } from 'react';

export function useFormField(error?: string) {
  const id = useId();
  const errorId = `${id}-error`;
  return {
    id,
    labelProps: { htmlFor: id },
    inputProps: {
      id,
      'aria-invalid': error ? (true as const) : undefined,
      'aria-describedby': error ? errorId : undefined,
    },
    errorProps: { id: errorId, role: 'alert' as const },
  };
}
