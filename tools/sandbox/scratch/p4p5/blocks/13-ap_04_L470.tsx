async function onSubmit() {
  setPending(true);
  try {
    if (new Date() > tx.disputeWindowEndsAt) { toast.error("Window closed"); return; }   // domain + UI mixed
    const res = await fetch("/api/disputes", { method: "POST", body: JSON.stringify(draft) });
    if (res.status === 409) { toast.error("Already raised"); return; }                      // infra + UI mixed
    const data = await res.json();
    queryClient.invalidateQueries({ queryKey: ["disputes"] });                              // cache
    analytics.track("dispute_raised");                                                      // cross-cutting (global)
    navigate(`/disputes/${data.id}`);                                                       // routing
  } catch { toast.error("Something went wrong"); }
  finally { setPending(false); }                                                            // forgot: unmounted component updates are harmless in React 18+, but the flow is untestable
}
export {};
