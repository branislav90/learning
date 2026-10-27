function usePageView(name: string) {
  useEffect(() => { track("view", { name }); }, [name]);
}
export {};
