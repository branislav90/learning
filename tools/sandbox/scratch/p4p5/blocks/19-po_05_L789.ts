type FieldTag = 'input' | 'select' | 'textarea';
type FieldOwn = { label: string };

type FieldProps<C extends FieldTag> =
  FieldOwn &
  { as?: C } &
  Omit<ComponentPropsWithoutRef<C>, keyof FieldOwn | 'as'> &
  (C extends 'select' ? { options: readonly { value: string; label: string }[]; type?: never } :
   C extends 'textarea' ? { type?: never; options?: never } :
   { options?: never }) &
  { ref?: ComponentPropsWithRef<C>['ref'] };

export function Field<C extends FieldTag = 'input'>(props: FieldProps<C>) { /* branch on props.as */ return null; }
export {};
