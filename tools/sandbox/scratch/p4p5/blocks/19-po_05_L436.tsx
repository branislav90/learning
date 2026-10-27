// Legacy, for reading existing code. Do not write this in new React 19 code.
type PolymorphicComponent = <C extends React.ElementType = 'span'>(
  props: PolymorphicProps<C, TextOwnProps> & { ref?: PolymorphicRef<C> },
) => React.ReactElement | null;

export const Text: PolymorphicComponent = React.forwardRef(
  <C extends React.ElementType = 'span'>({ as, ...rest }: PolymorphicProps<C, TextOwnProps>, ref?: PolymorphicRef<C>) => {
    const Component: React.ElementType = as ?? 'span';
    return <Component ref={ref} {...rest} />;
  },
) as PolymorphicComponent;
export {};
