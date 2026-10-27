type Tone = "neutral" | "success" | "danger";
const TONE_CLASS = {
  neutral: "badge",
  success: "badge badge--ok",
  danger: "badge badge--err",
} as const satisfies Record<Tone, string>;

type BadgeProps = React.ComponentProps<"span"> & { tone?: Tone };

function Badge({ tone = "neutral", className, ...rest }: BadgeProps) {
  return <span {...rest} className={className ? `${TONE_CLASS[tone]} ${className}` : TONE_CLASS[tone]} />;
}
export {};
