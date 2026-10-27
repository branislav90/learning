const Bar = styled.div`
  width: var(--pct);
  height: 8px;
  background: var(--color-action-primary);
`;
<Bar style={{ "--pct": `${pct}%` } as React.CSSProperties} />
export {};
