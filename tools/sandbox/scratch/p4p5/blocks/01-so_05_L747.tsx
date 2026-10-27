function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input type="search" value={value} onChange={(e) => onChange(e.target.value)} />;
}
export {};
