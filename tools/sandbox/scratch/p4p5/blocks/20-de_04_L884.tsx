import { useEffect, useRef } from "react";
function useDeprecationWarning(active: boolean, message: string) {
  const warned = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && active && !warned.current) {
      warned.current = true;
      console.warn(message);
    }
  }, [active, message]);
}
// in Button: const effective = outline ? "secondary" : variant;
export {};
