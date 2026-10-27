import { useCallback, useState } from "react";
export function useCouponDraft() {
  const [value, setValue] = useState("");
  const set = useCallback((v: string) => setValue(v.trim().toUpperCase()), []);
  const reset = useCallback(() => setValue(""), []);
  return { value, set, reset };
}
export {};
