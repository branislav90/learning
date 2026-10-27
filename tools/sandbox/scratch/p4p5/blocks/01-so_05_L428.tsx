function PrimaryButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button className="btn btn--primary" onClick={onClick}>{label}</button>;
}
export {};
