export function Settings({ boxed }: { boxed: boolean }) {
  return (
    <div className={boxed ? "box" : undefined}>
      <Field label="Name" />
    </div>
  );
}
