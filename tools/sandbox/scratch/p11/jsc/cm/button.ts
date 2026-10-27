import type { API, FileInfo } from 'jscodeshift';

export default function transform(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  root.find(j.JSXOpeningElement, { name: { type: 'JSXIdentifier', name: 'Button' } })
    .forEach(path => {
      for (const attr of path.node.attributes ?? []) {
        if (attr.type === 'JSXAttribute' && attr.name.name === 'kind') {
          attr.name.name = 'variant';
          changed = true;
        }
      }
    });

  return changed ? root.toSource() : file.source;
}
