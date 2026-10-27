type Tone = "neutral" | "success" | "danger";
const tones: Record<Tone, string> = {
  neutral: "bg-surface-sunken text-default",
  success: "bg-success-surface text-success",
  danger:  "bg-danger-surface text-danger",
};
export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return <span className={`rounded-md px-2 py-1 text-sm ${tones[tone]}`}>{children}</span>;
}
export {};
