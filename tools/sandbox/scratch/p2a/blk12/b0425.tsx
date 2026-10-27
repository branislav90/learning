// test-utils/expectPure.tsx
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect } from "vitest";

export function expectPureRender(element: ReactElement): void {
  const first = renderToStaticMarkup(element);
  const second = renderToStaticMarkup(element);
  const third = renderToStaticMarkup(element);
  expect(second).toBe(first);
  expect(third).toBe(first);
}
