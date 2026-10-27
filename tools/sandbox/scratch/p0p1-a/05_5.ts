interface TreeNode { id: string; children?: TreeNode[] }

// Recursive: concise; depth-limited by the call stack.
export function flattenRecursive(node: TreeNode): string[] {
  return [node.id, ...(node.children ?? []).flatMap(flattenRecursive)];
}

// Iterative: explicit stack in the heap; depth only limited by memory.
export function flattenIterative(root: TreeNode): string[] {
  const out: string[] = [];
  const stack: TreeNode[] = [root];
  while (stack.length > 0) {
    const node = stack.pop()!;
    out.push(node.id);
    const kids = node.children ?? [];
    for (let i = kids.length - 1; i >= 0; i--) stack.push(kids[i]); // keep left-to-right order
  }
  return out;
}
