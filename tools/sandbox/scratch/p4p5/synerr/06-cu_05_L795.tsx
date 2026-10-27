function A() { const [open, setOpen] = useState(false); useEffect(() => { if (!open) return; const h = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [open]); … }
// B and C repeat the same Escape-to-close logic with different state names
export {};
