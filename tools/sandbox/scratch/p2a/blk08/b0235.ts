interface TreeNode {
  name: string;
  children?: TreeNode[];
}

// Recursive "render": the call stack stores where we are.
function renderRecursive(node: TreeNode, log: string[]): void {
  log.push(`begin ${node.name}`);
  for (const child of node.children ?? []) {
    renderRecursive(child, log);
  }
  log.push(`complete ${node.name}`);
}

const tree: TreeNode = {
  name: "A",
  children: [{ name: "B", children: [{ name: "D" }] }, { name: "C" }],
};

const log: string[] = [];
renderRecursive(tree, log);
console.log(log.join(", "));
