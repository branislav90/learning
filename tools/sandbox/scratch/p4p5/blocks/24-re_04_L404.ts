// codemods/modal-open-api.ts
import type { API, FileInfo } from "jscodeshift";

export default function transform(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  root
    .find(j.JSXOpeningElement, { name: { type: "JSXIdentifier", name: "Modal" } })
    .forEach((path) => {
      const attrs = path.node.attributes ?? [];
      for (const attr of attrs) {
        if (attr.type !== "JSXAttribute") continue;
        if (attr.name.name === "visible") {
          attr.name.name = "open";
          changed = true;
        } else if (attr.name.name === "onClose" && attr.value?.type === "JSXExpressionContainer") {
          const handler = attr.value.expression;
          if (handler.type === "JSXEmptyExpression") continue;
          attr.name.name = "onOpenChange";
          // (open) => { if (!open) handler(); }
          attr.value.expression = j.arrowFunctionExpression(
            [j.identifier("open")],
            j.blockStatement([
              j.ifStatement(
                j.unaryExpression("!", j.identifier("open")),
                j.expressionStatement(j.callExpression(handler as never, []))
              ),
            ])
          );
          changed = true;
        }
      }
    });

  return changed ? root.toSource() : undefined;
}
export {};
