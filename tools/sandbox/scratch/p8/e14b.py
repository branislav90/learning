from ed import apply
E=[
("(ESLint 10 itself needs Node >= 20.19 / 22.13)","(ESLint 10 itself requires Node `^20.19.0 || ^22.13.0 || >=24`, per its package.json)"),
("*(TypeScript config support: verify)*","(`eslint.config.ts` is supported but \"requires additional setup\" per the ESLint docs)"),
("*(documented env var: verify)*","(documented env var; verified: it printed a per-rule timing table)"),
("*(verify in docs: `allowOnly` default depends on the `CI` env)*","(verified in the v3 config docs: `allowOnly` defaults to `!process.env.CI`)"),
("<https://eslint.org/docs/latest/use/configure/migration-guide> *(verify path)*","<https://eslint.org/docs/latest/use/configure/migration-guide>"),
("<https://github.com/vitest-dev/eslint-plugin-vitest> *(verify; may be `@vitest/eslint-plugin`)*","<https://github.com/vitest-dev/eslint-plugin-vitest> (npm package `@vitest/eslint-plugin`, verified 1.6.27)"),
]
apply("14-linting-and-static-analysis.md",E)
