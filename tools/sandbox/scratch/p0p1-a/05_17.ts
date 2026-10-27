interface TreeNode { id: string; children?: TreeNode[] }

function* walk(root: TreeNode): Generator<TreeNode, void, void> {
  const stack: TreeNode[] = [root];
  while (stack.length) {
    const n = stack.pop()!;
    yield n;                                     // pause point after each node
    for (let i = (n.children?.length ?? 0) - 1; i >= 0; i--) stack.push(n.children![i]);
  }
}

function runSliced(
  gen: Iterator<TreeNode>,
  visit: (n: TreeNode) => void,
  sliceMs = 5,
): Promise<void> {
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const step = () => {
      const start = performance.now();
      for (;;) {
        const r = gen.next();
        if (r.done) { resolve(); return; }
        visit(r.value);
        if (performance.now() - start >= sliceMs) break;
      }
      channel.port2.postMessage(null);            // schedule the next slice as a new task
    };
    channel.port1.onmessage = step;
    step();
  });
}
