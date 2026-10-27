function useThrowAsync() {
  const [, setState] = useState();
  return (error: unknown) =>
    setState(() => { throw error; }); // thrown during the *render* triggered by this update
}
export {};
