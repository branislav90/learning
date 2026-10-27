import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
export default tseslint.config(
  ...tseslint.configs.recommendedTypeChecked,
  { plugins: { 'react-hooks': reactHooks },
    rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'error', '@typescript-eslint/no-floating-promises': 'error', '@typescript-eslint/no-explicit-any': 'error',
      'no-restricted-imports': ['error', { patterns: [{ group: ['@/features/*/internal/*', '@/features/*/*/*'], message: 'Import from the feature public API.' }] }] } },
);
