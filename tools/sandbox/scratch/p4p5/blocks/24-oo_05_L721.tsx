type Node =
  | { kind: "text"; value: string }
  | { kind: "bold"; children: Node[] }
  | { kind: "link"; href: string; children: Node[] }
  | { kind: "list"; items: Node[][] };

function assertNever(x: never): never { throw new Error(`Unhandled ${JSON.stringify(x)}`); }

function Render({ node }: { node: Node }): ReactNode {
  switch (node.kind) {
    case "text": return node.value;
    case "bold": return <strong>{node.children.map((c, i) => <Render key={i} node={c} />)}</strong>;
    case "link": return <a href={node.href}>{node.children.map((c, i) => <Render key={i} node={c} />)}</a>;
    case "list": return <ul>{node.items.map((it, i) => <li key={i}>{it.map((c, j) => <Render key={j} node={c} />)}</li>)}</ul>;
    default: return assertNever(node);
  }
}
export {};
