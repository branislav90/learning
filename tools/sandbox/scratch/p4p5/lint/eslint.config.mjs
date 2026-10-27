import tseslint from "typescript-eslint";
export default [{ files: ["src/**/*.ts"], languageOptions: { parser: tseslint.parser }, plugins: {"@typescript-eslint": tseslint.plugin}, rules: { "@typescript-eslint/no-restricted-imports": ["error", { paths: [{ name: "react", message: "m", allowTypeImports: true }] }] } }];
