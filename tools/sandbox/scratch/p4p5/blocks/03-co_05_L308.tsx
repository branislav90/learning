// "Subclass" attempt using spread and a type extension
type ButtonProps = { label: string; onClick: () => void };
function Button({ label, onClick }: ButtonProps) { return <button onClick={onClick}>{label}</button>; }

type IconButtonProps = ButtonProps & { icon: string };
function IconButton({ label, onClick, icon }: IconButtonProps) {
  // Reimplements Button instead of reusing it
  return <button onClick={onClick}><img src={icon} alt="" /> {label}</button>;
}
export {};
