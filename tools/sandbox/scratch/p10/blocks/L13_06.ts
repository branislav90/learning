import type { API, FileInfo } from 'jscodeshift';

export default function transform(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  root.find(j.CallExpression, {
    callee: { type: 'MemberExpression', object: { name: 'ReactDOM' }, property: { name: 'render' } },
  }).forEach((path) => {
    const [element, container] = path.node.arguments;
    if (!element || !container) return;
    j(path.parent).replaceWith(
      j.expressionStatement(
        j.callExpression(
          j.memberExpression(j.callExpression(j.identifier('createRoot'), [container as any]), j.identifier('render')),
          [element as any]
        )
      )
    );
    changed = true;
  });

  if (!changed) return undefined;

  const hasImport = root.find(j.ImportDeclaration, { source: { value: 'react-dom/client' } }).size() > 0;
  if (!hasImport) {
    root.get().node.program.body.unshift(
      j.importDeclaration(
        [j.importSpecifier(j.identifier('createRoot'))],
        j.literal('react-dom/client')
      )
    );
  }
  return root.toSource();
}
