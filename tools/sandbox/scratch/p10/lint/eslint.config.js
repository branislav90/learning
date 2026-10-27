export default [{
  files: ["src/features/**/*.js"],
  languageOptions: { sourceType: "module" },
  rules: { "no-restricted-imports": ["error", { patterns: [{ group: ["@/features/*/*", "!@/features/*/index"], message: "public only" }] }] },
}];
