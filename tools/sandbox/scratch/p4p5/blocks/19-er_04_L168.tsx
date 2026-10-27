function useThrowAsync() {
  const [, setState] = useState<unknown>();
  return (error: unknown) => setState(() => { throw error; });   // thrown during the state updater → during render
}
export {};
