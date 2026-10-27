import { renderHook, act } from "@testing-library/react";
import { useToggle } from "./use-toggle";

test("toggle is referentially stable and flips the value", () => {
  const { result, rerender } = renderHook(() => useToggle(false));
  const toggleBefore = result.current[1].toggle;

  act(() => result.current[1].toggle());
  expect(result.current[0]).toBe(true);

  rerender();
  expect(result.current[1].toggle).toBe(toggleBefore);   // identity contract
});
export {};
