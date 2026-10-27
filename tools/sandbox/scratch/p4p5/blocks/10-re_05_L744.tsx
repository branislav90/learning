type TreeProps<T> = {
  roots: readonly T[];
  getKey: (n: T) => string;
  getChildren: (n: T) => readonly T[];
  renderNode: (n: T, s: { depth: number; expanded: boolean; toggle: () => void; hasChildren: boolean }) => ReactNode;
};

export function Tree<T>(props: TreeProps<T>) {
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  const toggle = (key: string) =>
    setExpanded((prev) => { const next = new Set(prev); next.has(key) ? next.delete(key) : next.add(key); return next; });

  function renderLevel(nodes: readonly T[], depth: number): ReactNode {
    return (
      <ul role={depth === 0 ? "tree" : "group"}>
        {nodes.map((n) => {
          const key = props.getKey(n);
          const children = props.getChildren(n);
          const isOpen = expanded.has(key);
          return (
            <li key={key} role="treeitem" aria-expanded={children.length ? isOpen : undefined}>
              {props.renderNode(n, { depth, expanded: isOpen, toggle: () => toggle(key), hasChildren: children.length > 0 })}
              {isOpen && children.length > 0 && renderLevel(children, depth + 1)}
            </li>
          );
        })}
      </ul>
    );
  }
  return <>{renderLevel(props.roots, 0)}</>;
}
export {};
