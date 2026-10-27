const rows = [{ id: "a" }, { id: "b" }];
const { result } = renderHook(() => useSelection(rows, (r) => r.id));
act(() => result.current.toggle(rows[0]));
expect(result.current.count).toBe(1);
act(() => result.current.toggle(rows[0]));
expect(result.current.count).toBe(0);
act(() => { result.current.toggle(rows[0]); result.current.toggle(rows[1]); });
expect(result.current.count).toBe(2);   // functional updates queue correctly (batched)
act(() => result.current.clear());
expect(result.current.isSelected(rows[0])).toBe(false);
export {};
