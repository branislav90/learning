// tests/architecture/boundaries.test.ts
import { cruise } from 'dependency-cruiser'

describe('architecture', () => {
  it('has no circular dependencies', async () => {
    const { output } = await cruise(['src'], { validate: true, ruleSet: rules })
    expect(output.summary.violations.filter((v) => v.rule.name === 'no-circular')).toEqual([])
  })

  it('domain layers are framework-free', async () => {
    const { output } = await cruise(['src/modules'], { validate: true, ruleSet: rules })
    expect(output.summary.violations.filter((v) => v.rule.name === 'domain-is-pure')).toEqual([])
  })
})
