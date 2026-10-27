async function renderAsync(node: TreeNode, log: string[]): Promise<void> {
  log.push(`begin ${node.name}`);
  for (const child of node.children ?? []) {
    await Promise.resolve();      // "yield" so the browser can breathe
    await renderAsync(child, log);
  }
  log.push(`complete ${node.name}`);
}
