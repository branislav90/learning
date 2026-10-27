function Field({ label, hint, error, control }: {
  label: ReactNode; hint?: ReactNode; error?: ReactNode;
  control: (a: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean }) => ReactNode;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint != null && hintId, error != null && errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {control({ id, "aria-describedby": describedBy, "aria-invalid": error != null ? true : undefined })}
      {hint != null && <p id={hintId}>{hint}</p>}
      {error != null && <p id={errorId} role="alert">{error}</p>}
    </div>
  );
}
export {};
