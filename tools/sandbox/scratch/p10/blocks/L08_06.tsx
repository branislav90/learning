// src/shared/a11y/Announcer.tsx
import { createContext, use, useCallback, useMemo, useRef, useState, type ReactNode } from "react";

type Politeness = "polite" | "assertive";
const AnnouncerContext = createContext<(msg: string, p?: Politeness) => void>(() => {});

export function AnnouncerProvider({ children }: { children: ReactNode }) {
  const [polite, setPolite] = useState("");
  const [assertive, setAssertive] = useState("");
  const toggle = useRef(false);

  const announce = useCallback((message: string, p: Politeness = "polite") => {
    // Alternate a zero-width suffix so identical consecutive messages are still re-announced.
    toggle.current = !toggle.current;
    const text = message + (toggle.current ? "​" : "");
    (p === "assertive" ? setAssertive : setPolite)(text);
  }, []);

  const value = useMemo(() => announce, [announce]);
  return (
    <AnnouncerContext value={value}>
      {children}
      <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{polite}</div>
      <div className="visually-hidden" role="alert" aria-live="assertive" aria-atomic="true">{assertive}</div>
    </AnnouncerContext>
  );
}

export const useAnnounce = () => use(AnnouncerContext);
