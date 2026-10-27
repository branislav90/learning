import {
  createContext, use, useState, useMemo,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type Targets = {
  header: HTMLElement | null;
  sidebar: HTMLElement | null;
};
type LayoutCtx = {
  targets: Targets;
  register: Record<keyof Targets, (el: HTMLElement | null) => void>;
};

const LayoutContext = createContext<LayoutCtx | null>(null);

export function AppLayout({ children }: { children: ReactNode }) {
  const [targets, setTargets] = useState<Targets>({ header: null, sidebar: null });

  // Stable callback refs: one per region, created once. A callback ref whose identity
  // changes every render is detached (null) and re-attached on every commit.
  const register = useMemo(
    () => ({
      header: (el: HTMLElement | null) => setTargets((t) => ({ ...t, header: el })),
      sidebar: (el: HTMLElement | null) => setTargets((t) => ({ ...t, sidebar: el })),
    }),
    [],
  );

  return (
    <LayoutContext value={{ targets, register }}>
      <div className="app">
        <header ref={register.header} />
        <aside ref={register.sidebar} />
        <main>{children}</main>
      </div>
    </LayoutContext>
  );
}

function Fill({ name, children }: { name: keyof Targets; children: ReactNode }) {
  const ctx = use(LayoutContext);
  if (!ctx) throw new Error("<AppLayout.Header/Sidebar> must be inside <AppLayout>");
  const target = ctx.targets[name];
  return target ? createPortal(children, target) : null;
}

AppLayout.Header = ({ children }: { children: ReactNode }) => <Fill name="header">{children}</Fill>;
AppLayout.Sidebar = ({ children }: { children: ReactNode }) => <Fill name="sidebar">{children}</Fill>;
export {};
