export {};
function Select<V extends string | number>({ value, onChange, options }: SelectProps<V>) {
  return <select onChange={(e) => onChange(e.currentTarget.value)} /* … */ />;
}
