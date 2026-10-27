import tseslint from 'typescript-eslint';
export default [
  { languageOptions: { parser: tseslint.parser } },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/features/**/api/**', 'src/lib/query/**'],
    rules: { 'no-restricted-imports': ['error', { paths: [{ name: '@tanstack/react-query', importNames: ['useQuery', 'useMutation', 'useQueryClient'], message: 'Import data hooks from the feature api module, not directly from the library.' }] }] },
  },
];
