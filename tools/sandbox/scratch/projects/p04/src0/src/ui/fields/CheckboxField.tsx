import { fieldId } from "./fieldId";
export function CheckboxField({ path, label, checked, onCheckedChange }: { path: string; label: string; checked: boolean; onCheckedChange: (v: boolean) => void }) {
  return <label htmlFor={fieldId(path)}><input id={fieldId(path)} type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} />{label}</label>;
}
