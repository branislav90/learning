/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "Cycles cause init-order bugs and defeat modular reasoning.",
      from: {},
      to: { circular: true },
    },
    {
      name: "shared-not-to-features",
      severity: "error",
      comment: "shared/ is below features/ in the dependency order (ADR-007).",
      from: { path: "^src/shared/" },
      to: { path: "^src/(features|pages|app)/" },
    },
    {
      name: "features-public-api-only",
      severity: "error",
      comment: "Import a feature only through src/features/<name>/index.ts.",
      from: { path: "^src/(?!features/)", pathNot: "^src/features/" },
      to: {
        path: "^src/features/[^/]+/.+",
        pathNot: "^src/features/[^/]+/index\\.(ts|tsx)$",
      },
    },
    {
      name: "no-cross-feature",
      severity: "error",
      comment: "Features must not import other features (use shared contracts or events).",
      from: { path: "^src/features/([^/]+)/" },
      to: { path: "^src/features/(?!$1/)", },
    },
    {
      name: "domain-framework-free",
      severity: "error",
      from: { path: "/domain/" },
      to: { path: "^node_modules/(react|react-dom|react-router)(/|$)" },
    },
    {
      name: "no-orphans",
      severity: "warn",
      from: { orphan: true, pathNot: "(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|json)$|\\.d\\.ts$|(^|/)tsconfig\\.json$|\\.test\\.tsx?$|main\\.tsx$" },
      to: {},
    },
  ],
  options: {
    tsConfig: { fileName: "tsconfig.json" },
    doNotFollow: { path: "node_modules" },
    exclude: { path: "\\.test\\.tsx?$|__fixtures__" },
    enhancedResolveOptions: { exportsFields: ["exports"], conditionNames: ["import", "require", "node", "default", "types"] },
  },
};
