interface TreeNode { children?: TreeNode[] }

export function depth(root: TreeNode): number {
  let max = 0;
  const stack: Array<{ node: TreeNode; d: number }> = [{ node: root, d: 1 }];
  while (stack.length > 0) {
    const { node, d } = stack.pop()!;
    if (d > max) max = d;
    for (const child of node.children ?? []) stack.push({ node: child, d: d + 1 });
  }
  return max;
}
