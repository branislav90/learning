// eslint.config.js  (ESM). ⚠ Verify every import/export name against current plugin READMEs.
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import testingLibrary from 'eslint-plugin-testing-library';
import vitest from '@vitest/eslint-plugin';

export default defineConfig(
  // 1. Global ignores (an object with ONLY `ignores`)
  { ignores: ['dist/**', 'coverage/**', 'playwright-report/**', '**/*.d.ts', 'eslint.config.js'] },

  // 2. Baseline JS rules
  js.configs.recommended,

  // 3. TypeScript, type-aware
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        projectService: true,                    // (verify option name/version)
        tsconfigRootDir: import.meta.dirname,    // Node >= 20.11 (verify)
      },
    },
  },

  // 4. React hooks (registering plugin explicitly keeps this independent of preset names)
  reactHooks.configs.flat.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'react-hooks/exhaustive-deps': 'error',    // recommended sets it to 'warn'
    },
  },

  // 5. Accessibility lint for JSX
  {
    files: ['**/*.tsx'],
    ...jsxA11y.flatConfigs.recommended,          // (verify export name for your plugin version)
  },

  // 6. Project-specific correctness rules
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description', 'ts-ignore': true }],
      'no-restricted-syntax': ['error', {
        selector: "CallExpression[callee.property.name='json'][callee.object.callee.name='fetch']",
        message: 'Use fetchJson(schema, url) from src/api/http.ts so responses are validated.',
      }],
    },
  },

  // 7. Tests: Testing Library + Vitest rules, relaxed unsafe-any for mocks
  {
    files: ['**/*.{test,spec}.{ts,tsx}'],
    ...testingLibrary.configs['flat/react'],     // (verify)
  },
  {
    files: ['**/*.{test,spec}.{ts,tsx}'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,       // (verify)
      '@typescript-eslint/unbound-method': 'off', // common noise with vi.fn / mocked methods
    },
  },

  { linterOptions: { reportUnusedDisableDirectives: 'error' } },
);
