type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export function Heading<C extends HeadingTag = 'h2'>({ as, size = 'lg', ...rest }: PolymorphicProps<C, { size?: 'sm' | 'md' | 'lg' | 'xl' }>) {
  const Tag: ElementType = as ?? 'h2';
  return <Tag className={`heading heading--${size}`} {...rest} />;
}
// <Heading as="h3" size="xl">…</Heading>
export {};
