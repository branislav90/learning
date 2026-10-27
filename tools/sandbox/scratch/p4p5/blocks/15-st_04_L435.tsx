const TABS = ["overview", "billing"] as const;
type Tab = (typeof TABS)[number];

function parseTab(raw: string | null): Tab {
  return (TABS as readonly string[]).includes(raw ?? "") ? (raw as Tab) : "overview"; // untrusted input
}

function useTab(): [Tab, (t: Tab) => void] {
  const [params, setParams] = useSearchParams();     // e.g. React Router's hook; verify signature in docs
  const tab = parseTab(params.get("tab"));
  const setTab = (t: Tab) =>
    setParams((prev) => { const n = new URLSearchParams(prev); n.set("tab", t); return n; }, { replace: true });
  return [tab, setTab];
}
export {};
