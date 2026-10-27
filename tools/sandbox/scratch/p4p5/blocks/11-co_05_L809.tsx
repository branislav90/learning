function Switch({ checked, defaultChecked = false, onCheckedChange }: {
  checked?: boolean; defaultChecked?: boolean; onCheckedChange?: (c: boolean) => void;
}) {
  const [on, setOn] = useControllableState<boolean>({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange, name: "Switch" });
  return <button role="switch" aria-checked={on} onClick={() => setOn(!on)}>{on ? "On" : "Off"}</button>;
}
export {};
