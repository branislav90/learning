import { cruise } from 'dependency-cruiser';
const rules = { forbidden: [
  { name: 'no-circular', severity: 'error', from: {}, to: { circular: true } },
  { name: 'domain-is-pure', severity: 'error', from: { path: '^src/modules/[^/]+/domain' }, to: { path: 'node_modules/react', dependencyTypes: ['npm'] } },
] };
for (const [files, label] of [[['src'], 'all']]) {
  const { output, exitCode } = await cruise(files, { validate: true, ruleSet: rules });
  console.log(label, typeof output, exitCode, output.summary.violations.map(v => v.rule.name + ':' + v.from + '->' + v.to));
}
