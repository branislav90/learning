type FieldRenderProps<V> = {
  field: { value: V; onChange: (next: V) => void; onBlur: () => void; name: string };
  error: string | undefined;
};

function Field<V>({ name, form, render }: {
  name: string;
  form: FormApi;                                   // some form store; details omitted
  render: (p: FieldRenderProps<V>) => ReactNode;
}) {
  const value = useFormValue<V>(form, name);
  const error = useFormError(form, name);
  return render({
    field: { name, value, onChange: (v) => form.set(name, v), onBlur: () => form.touch(name) },
    error,
  });
}

<Field<string> name="country" form={form}
  render={({ field, error }) => (
    <CountrySelect value={field.value} onChange={field.onChange} onBlur={field.onBlur} invalid={!!error} />
  )}
/>
export {};
