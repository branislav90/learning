from apply import apply
apply('33-scenario-b-text-update.md', [
("**Observable behavior** (stable for years; verify with `childNodes`)","**Observable behavior** (stable for years; confirmed on 19.3.1: `childNodes.length` 2/1/1 for the three shapes)"),
("a different count is a finding to investigate (⚠ implementation-route differences), not","a different count is a finding to investigate (implementation-route differences; on react 19.3.1 the equivalent run produced exactly 3 `characterData` records and nothing else), not"),
("(and, separately, **attribute modifications**) ⚠ the exact menu labels","(and, separately, **attribute modifications**); the exact menu labels"),
("**Mitigations** ⚠ verify against current guidance:","**Mitigations** (community guidance, not a React guarantee):"),
("See [31 §3.5](./31-reading-react-source.md); verify names |","See [31 §3.5](./31-reading-react-source.md) |"),
])
