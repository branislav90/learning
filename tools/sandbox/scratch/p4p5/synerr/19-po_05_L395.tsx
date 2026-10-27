type ButtonBase = { variant?: 'primary' | 'secondary'; asChild?: boolean } & React.ComponentPropsWithRef<'button'>;

export function Button({ asChild, variant = 'primary', className, ...rest }: ButtonBase) {
  const Component = asChild ? Slot : 'button';
  return <Component className={`btn btn--${variant} ${className ?? ''}`} {...rest} />;
}

<Button asChild variant="secondary"><a href="/pricing">Pricing</a></Button>
<Button asChild><Link to="/pricing">Pricing</Link></Button>
export {};
