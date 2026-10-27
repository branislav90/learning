type BoxOwn = { p?: 0 | 1 | 2 | 3 | 4; gap?: 0 | 1 | 2 | 3 | 4 };
export function Box<C extends ElementType = 'div'>({ as, p = 0, gap = 0, className, ...rest }: PolymorphicProps<C, BoxOwn> & { className?: string }) {
  const Component: ElementType = as ?? 'div';
  return <Component className={`box p-${p} gap-${gap} ${className ?? ''}`} {...rest} />;
}
// type tests
<Box as="a" href="/x" />;
// @ts-expect-error href is not valid on div
<Box href="/x" />;
// @ts-expect-error gap must be 0..4
<Box gap={7} />;
export {};
