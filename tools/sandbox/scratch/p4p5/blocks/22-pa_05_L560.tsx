let counter = 0;
export function Field({ label }: { label: string }) {
  const id = `field-${counter++}`;
  return (<><label htmlFor={id}>{label}</label><input id={id} /></>);
}
export {};
