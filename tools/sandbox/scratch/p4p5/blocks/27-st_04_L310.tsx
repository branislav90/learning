// styled-components/Emotion-style API (illustrative; verify current package APIs)
const Bar = styled.div<{ $pct: number }>`
  width: ${p => p.$pct}%;           /* ❌ unbounded: new class per distinct percentage */
  height: 8px;
  background: var(--color-action-primary);
`;
export {};
