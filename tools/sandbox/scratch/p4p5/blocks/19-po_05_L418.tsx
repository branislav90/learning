type RenderProps = React.ComponentPropsWithRef<'button'>;

export function Button({ render, className, ...rest }: {
  render?: (props: RenderProps & { className: string }) => React.ReactElement;
  variant?: 'primary' | 'secondary';
} & RenderProps) {
  const props = { ...rest, className: `btn ${className ?? ''}` };
  return render ? render(props) : <button type="button" {...props} />;
}

<Button render={(p) => <a {...p} href="/pricing" />}>Pricing</Button>
export {};
