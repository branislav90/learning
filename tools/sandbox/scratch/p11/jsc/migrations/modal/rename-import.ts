import type { API, FileInfo } from "jscodeshift";

export const parser = "tsx";

export default function transform(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let changed = false;

  root
    .find(j.ImportDeclaration)
    .filter((p) => String(p.node.source.value).endsWith("/LegacyModal"))
    .forEach((p) => {
      const defaultSpec = (p.node.specifiers ?? []).find((s) => s.type === "ImportDefaultSpecifier");
      if (!defaultSpec || !defaultSpec.local) return;
      const local = defaultSpec.local.name;
      const imported = j.identifier("Modal");
      const spec = local === "Modal" ? j.importSpecifier(imported) : j.importSpecifier(imported, j.identifier(local));
      const next = j.importDeclaration([spec], j.literal("@acme/ui"));
      next.comments = p.node.comments; // keep comments attached to the old import
      p.replace(next);
      changed = true;
    });

  return changed ? root.toSource() : undefined;
}
