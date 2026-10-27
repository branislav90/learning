export function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", () => setW(window.innerWidth));
  }, []);
  return w;
}
export {};
