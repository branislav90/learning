function useWidth() {
  const [w, setW] = useState(window.innerWidth);   // render-time read
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return w;
}
export {};
