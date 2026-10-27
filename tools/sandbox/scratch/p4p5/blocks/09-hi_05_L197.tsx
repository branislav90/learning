import { useEffect, useState, type ComponentType } from "react";

type WindowSize = { width: number; height: number };
type InjectedProps = { size: WindowSize };

export function withWindowSize<P extends InjectedProps>(
  Component: ComponentType<P>,
): ComponentType<Omit<P, keyof InjectedProps>> {
  function WithWindowSize(props: Omit<P, keyof InjectedProps>) {
    const [size, setSize] = useState<WindowSize>(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }));

    useEffect(() => {
      const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);

    // TS cannot prove Omit<P,K> & {size} is assignable to P for generic P, so we assert once, here.
    return <Component {...(props as P)} size={size} />;
  }
  WithWindowSize.displayName = `WithWindowSize(${Component.displayName ?? Component.name})`;
  return WithWindowSize;
}

// Usage
function Chart({ data, size }: { data: number[]; size: WindowSize }) {
  return <svg width={size.width / 2} height={size.height / 3}>{/* ... */}</svg>;
}
export const ResponsiveChart = withWindowSize(Chart);
// <ResponsiveChart data={[1,2,3]} />   // 'size' is no longer a required prop
export {};
