export {};
function ProfileForm() {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save(values: FormValues) {
    setStatus("saving");
    try {
      await api.post("/profile", values);       // client throws HttpError on non-2xx
      setStatus("saved");
    } catch (err) {
      reporter.capture(err, { source: "profile.save", level: "warning" });  // handled, but worth knowing about
      setStatus("error");                          // UI shows an actionable message with retry
    }
  }
  // ...
}
