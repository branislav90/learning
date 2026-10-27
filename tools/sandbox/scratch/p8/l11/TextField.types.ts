export type TextFieldProps =
  | { label: string; 'aria-label'?: never; value: string; onChange: (v: string) => void; defaultValue?: never }
  | { label: string; 'aria-label'?: never; value?: never; onChange?: (v: string) => void; defaultValue?: string };
