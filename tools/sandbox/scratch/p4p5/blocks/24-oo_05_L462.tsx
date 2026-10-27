type FormShellProps = {
  title: string;
  fields: ReactNode;
  footer?: ReactNode;
};
function FormShell({ title, fields, footer }: FormShellProps) {
  return (
    <form>
      <h2>{title}</h2>
      {fields}
      {footer ?? <button>Save</button>}
    </form>
  );
}
function ProfileForm() { return <FormShell title="Profile" fields={<ProfileFields />} />; }
export {};
