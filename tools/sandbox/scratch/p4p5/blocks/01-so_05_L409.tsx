function Notice({ kind, children, action }: { kind: Kind; children: React.ReactNode; action?: React.ReactNode }) {
  const s = NOTICE_STYLES[kind];
  return (
    <div className={s.className} role={s.role}>
      <span aria-hidden="true">{s.icon}</span>
      <div>{children}</div>
      {action}
    </div>
  );
}
export {};
