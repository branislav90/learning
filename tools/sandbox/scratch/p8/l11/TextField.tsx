import { useId, useState } from 'react';
import type { TextFieldLikeProps } from './contract';
export function TextField({ label, value, defaultValue = '', onChange, error, disabled }: TextFieldLikeProps) {
  const id = useId(); const errId = useId();
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined; const shown = controlled ? value : inner;
  return (<div><label htmlFor={id}>{label}</label><input id={id} value={shown} disabled={disabled} aria-invalid={error ? true : undefined} aria-describedby={error ? errId : undefined}
    onChange={(e) => { if (!controlled) setInner(e.target.value); onChange?.(e.target.value); }} />{error && <p id={errId}>{error}</p>}</div>);
}
