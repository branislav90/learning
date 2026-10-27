export {};
async function save(values: FormValues) {
  try {
    await api.post("/profile", values);
  } catch (e) {
    console.log(e);                 // ❌ invisible in production; user sees success state
  }
  setSaved(true);                    // ❌ runs even after failure
}

class Boundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? null : this.props.children; }   // ❌ blank fallback, no reporting, no recovery
}
