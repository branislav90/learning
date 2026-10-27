// Before: HOC (legacy style)
function withWindowWidth<P extends { width: number }>(Wrapped: React.ComponentType<P>) {
  return function WithWindowWidth(props: Omit<P, "width">) {
    const [width, setWidth] = React.useState(window.innerWidth);
    React.useEffect(() => {
      const onResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);
    return <Wrapped {...(props as P)} width={width} />;
  };
}
export {};
