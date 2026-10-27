export function Button({
  variant = "solid", tone = "neutral", size = "md",
  loading = false, leading, trailing, asChild = false,
  disabled, children, ref, ...rest
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className="btn"
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={asChild ? undefined : disabled || loading}
      {...rest}
    >
      {leading && <span className="btn__leading" aria-hidden="true">{leading}</span>}
      <span className="btn__label">{children}</span>
      {trailing && <span className="btn__trailing" aria-hidden="true">{trailing}</span>}
    </Comp>
  );
}
export {};
