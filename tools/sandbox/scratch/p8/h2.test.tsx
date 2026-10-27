import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { useEffect, useState, useCallback } from "react";
function useDebouncedValue<T>(value: T, delayMs: number): T { const [d, setD] = useState(value); useEffect(() => { const id = setTimeout(() => setD(value), delayMs); return () => clearTimeout(id); }, [value, delayMs]); return d; }
beforeEach(() => { vi.useFakeTimers(); }); afterEach(() => { vi.useRealTimers(); });
test("debounce", () => {
  const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), { initialProps: { value: "a" } });
  rerender({ value: "ab" }); act(() => { vi.advanceTimersByTime(200); }); rerender({ value: "abc" });
  act(() => { vi.advanceTimersByTime(299); }); expect(result.current).toBe("a");
  act(() => { vi.advanceTimersByTime(1); }); expect(result.current).toBe("abc");
});
test("unmount", () => {
  const { rerender, unmount } = renderHook(({ v }) => useDebouncedValue(v, 300), { initialProps: { v: 1 } });
  rerender({ v: 2 }); expect(vi.getTimerCount()).toBe(1); unmount(); expect(vi.getTimerCount()).toBe(0);
});
test("counter", () => {
  const clamp = (n: number, max: number) => Math.min(n, max);
  const { result } = renderHook(() => { const [count, setCount] = useState(5); const increment = useCallback(() => setCount(c => clamp(c + 1, 7)), []); return { count, increment }; });
  act(() => { result.current.increment(); result.current.increment(); result.current.increment(); });
  expect(result.current.count).toBe(7);
});
