const TextField = createField('text');
const NumberField = createField('number');
const fieldByKind = { text: TextField, number: NumberField } as const;

function Form({ kind }: { kind: 'text' | 'number' }) {
  const Field = fieldByKind[kind];   // stable reference per kind
  ...
}
export {};
