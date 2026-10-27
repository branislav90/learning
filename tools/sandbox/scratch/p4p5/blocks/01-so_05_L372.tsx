type Notice = { kind: "info" | "warning" | "error" | "success"; text: string };

function NoticeBanner({ kind, text }: Notice) {
  let icon = "ℹ";
  let className = "banner";
  if (kind === "warning") { icon = "⚠"; className += " banner--warn"; }
  else if (kind === "error") { icon = "✖"; className += " banner--err"; }
  else if (kind === "success") { icon = "✔"; className += " banner--ok"; }
  return <div className={className} role={kind === "error" ? "alert" : "status"}>{icon} {text}</div>;
}
export {};
