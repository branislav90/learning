type Kind = "info" | "warning" | "error" | "success";

const NOTICE_STYLES = {
  info:    { icon: "ℹ", className: "banner", role: "status" },
  warning: { icon: "⚠", className: "banner banner--warn", role: "status" },
  error:   { icon: "✖", className: "banner banner--err", role: "alert" },
  success: { icon: "✔", className: "banner banner--ok", role: "status" },
} as const satisfies Record<Kind, { icon: string; className: string; role: "status" | "alert" }>;

function NoticeBanner({ kind, text }: { kind: Kind; text: string }) {
  const s = NOTICE_STYLES[kind];
  return <div className={s.className} role={s.role}>{s.icon} {text}</div>;
}
export {};
