type ButtonProps = {
  primary?: boolean; danger?: boolean; outline?: boolean; ghost?: boolean;
  small?: boolean; large?: boolean; loading?: boolean; fullWidth?: boolean;
  icon?: string; iconRight?: boolean; href?: string; disabled?: boolean;
  children: React.ReactNode; onClick?: () => void;
};

export function Button(p: ButtonProps) {
  const cls = [
    "btn",
    p.primary && "btn-primary",
    p.danger && "btn-danger",
    p.outline && "btn-outline",
    p.ghost && "btn-ghost",
    p.small && "btn-sm",
    p.large && "btn-lg",
    p.fullWidth && "btn-block",
  ].filter(Boolean).join(" ");
  const content = (
    <>
      {p.icon && !p.iconRight && <img src={p.icon} alt="" />}
      {p.loading ? "…" : p.children}
      {p.icon && p.iconRight && <img src={p.icon} alt="" />}
    </>
  );
  return p.href
    ? <a className={cls} href={p.href}>{content}</a>
    : <button className={cls} onClick={p.onClick} disabled={p.disabled || p.loading}>{content}</button>;
}
export {};
