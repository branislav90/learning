import type { API, FileInfo } from 'jscodeshift';

export default function transform(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  root.find(j.JSXOpeningElement, { name: { type: 'JSXIdentifier', name: 'Button' } })
    .forEach((path) => {
      const attrs = path.node.attributes ?? [];
      const linkIdx = attrs.findIndex(
        (a) => a.type === 'JSXAttribute' && a.name.name === 'link'
      );
      if (linkIdx === -1) return;
      const hasVariant = attrs.some(
        (a) => a.type === 'JSXAttribute' && a.name.name === 'variant'
      );
      attrs.splice(linkIdx, 1);
      if (!hasVariant) {
        attrs.push(j.jsxAttribute(j.jsxIdentifier('variant'), j.stringLiteral('ghost')));
      }
      changed = true;
    });

  return changed ? root.toSource() : undefined;
}
