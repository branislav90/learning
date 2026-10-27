export function Heading({ level = 2, size, ...rest }: { level?: 1 | 2 | 3 | 4 | 5 | 6; size?: 'sm' | 'md' | 'lg' | 'xl' } & React.ComponentPropsWithoutRef<'h2'>) {
  const Tag = (`h${level}` as const);
  return <Tag className={`heading heading--${size ?? 'lg'}`} {...rest} />;
}
export {};
