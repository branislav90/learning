// form-field.tsx
import { createContext, use, useId, useState, useEffect, type ComponentProps, type ReactNode } from "react";

type FieldContextValue = {
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  hasDescription: boolean;
  setHasDescription: (v: boolean) => void;
};

const FieldContext = createContext<FieldContextValue | null>(null);

function useField(part: string) {
  const ctx = use(FieldContext);
  if (!ctx) throw new Error(`<${part}> must be rendered inside <FormField>.`);
  return ctx;
}

export const counter = { n: 0 };
export function FormField({ invalid = false, children }: { invalid?: boolean; children: ReactNode }) {
  counter.n++;
  const id = useId();
  const [hasDescription, setHasDescription] = useState(false);
  const value: FieldContextValue = {
    controlId: `${id}-control`,
    descriptionId: `${id}-description`,
    errorId: `${id}-error`,
    invalid,
    hasDescription,
    setHasDescription,
  };
  return (
    <FieldContext value={value}>
      <div data-invalid={invalid || undefined}>{children}</div>
    </FieldContext>
  );
}

export function FieldLabel(props: ComponentProps<"label">) {
  const f = useField("FormField.Label");
  return <label htmlFor={f.controlId} {...props} />;
}

export function FieldControl(props: ComponentProps<"input">) {
  const f = useField("FormField.Control");
  const describedBy = [f.hasDescription ? f.descriptionId : null, f.invalid ? f.errorId : null]
    .filter(Boolean)
    .join(" ");
  return (
    <input
      id={f.controlId}
      aria-invalid={f.invalid || undefined}
      aria-describedby={describedBy || undefined}
      {...props}
    />
  );
}

export function FieldDescription(props: ComponentProps<"p">) {
  const f = useField("FormField.Description");
  const { setHasDescription } = f;
  useEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);
  return <p id={f.descriptionId} {...props} />;
}

export function FieldError(props: ComponentProps<"p">) {
  const f = useField("FormField.Error");
  if (!f.invalid) return null;
  return <p id={f.errorId} role="alert" {...props} />;
}
export {};
