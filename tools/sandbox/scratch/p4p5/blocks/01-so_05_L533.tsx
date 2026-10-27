type FieldBase<T extends string, V> = { type: T; name: string; label: string; initial: V };
type TextField   = FieldBase<"text", string>;
type NumberField = FieldBase<"number", number> & { min?: number; max?: number };
type CheckField  = FieldBase<"checkbox", boolean>;
type Field = TextField | NumberField | CheckField;

type Renderer<F extends Field> = (props: { field: F; id: string }) => React.ReactNode;
type Registry = { [K in Field["type"]]: Renderer<Extract<Field, { type: K }>> };

const registry: Registry = {
  text:     ({ field, id }) => <input id={id} name={field.name} defaultValue={field.initial} />,
  number:   ({ field, id }) => <input id={id} name={field.name} type="number" min={field.min} max={field.max} defaultValue={field.initial} />,
  checkbox: ({ field, id }) => <input id={id} name={field.name} type="checkbox" defaultChecked={field.initial} />,
};

function renderField(f: Field, id: string) {
  const render = registry[f.type] as Renderer<Field>;
  return render({ field: f, id });
}
export {};
