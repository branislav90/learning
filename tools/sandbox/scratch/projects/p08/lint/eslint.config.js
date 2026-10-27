// eslint.config.js (excerpt)
export default [
  {
    files: ['src/shared/**', 'src/platform/**'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [
        { group: ['@/modules/*', '@/app/*'], message: 'shared/platform must not depend on modules or app (R1).' },
      ] }],
    },
  },
  {
    files: ['src/modules/*/**'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [
        // Deep imports into another module are forbidden; only the public entry/contracts are allowed.
        { group: ['@/modules/*/*', '!@/modules/*/contracts', '!@/modules/*/index'], message: 'Import other modules via their public API only (R2).' },
      ] }],
    },
  },
  {
    files: ['src/modules/*/domain/**'],
    rules: {
      'no-restricted-imports': ['error', {
        paths: ['react', 'react-dom', 'react-router', '@tanstack/react-query'],
        patterns: [
          // flat config REPLACES the options of the same rule from earlier blocks, so repeat R2 here
          { group: ['@/modules/*/*', '!@/modules/*/contracts', '!@/modules/*/index'], message: 'Import other modules via their public API only (R2).' },
          { group: ['../application/*', '../ui/*', '../infrastructure/*'], message: 'The domain layer must not depend on outer layers.' },
        ],
      }],
    },
  },
]
