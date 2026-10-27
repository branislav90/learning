import * as lib from 'acme-ui';
import { expect, test } from 'vitest';

test('public exports are stable', () => {
  expect(Object.keys(lib).sort()).toMatchInlineSnapshot(`
    [
      "Tab",
      "TabList",
      "TabPanel",
      "Tabs",
      "useControllableState",
    ]
  `);
});
export {};
