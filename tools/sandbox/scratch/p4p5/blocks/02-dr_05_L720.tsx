function Banner({ tone, children, actions, onDismiss }: {
  tone: "info" | "error"; children: React.ReactNode; actions?: React.ReactNode; onDismiss?: () => void;
}) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`banner banner--${tone}`}>
      <Icon tone={tone} />
      <div>{children}</div>
      {actions}
      {onDismiss && <button aria-label="Dismiss" onClick={onDismiss}>×</button>}
    </div>
  );
}
// <Banner tone="error" actions={<button onClick={retry}>Retry</button>} onDismiss={close}><b>Failed</b></Banner>
export {};
