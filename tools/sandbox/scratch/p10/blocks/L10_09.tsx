export {};
function ChatLauncher() {
  const [state, setState] = useState<"idle" | "loading" | "ready" | "unavailable">("idle");
  async function open() {
    setState("loading");
    try { await loadScript("https://chat.vendor.example/widget.js", { timeoutMs: 8000 }); setState("ready"); }
    catch { setState("unavailable"); }              // fallback: show email/phone support link
  }
  if (state === "unavailable") return <a href="/support">Contact support</a>;
  return <button type="button" onClick={open} aria-busy={state === "loading"}>Chat with us</button>;
}
