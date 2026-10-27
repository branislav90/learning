import type * as React from 'react';
type RenderProps = React.HTMLAttributes<HTMLElement>;
export function Button({ render, className, ...rest }: {
  render?: (props: RenderProps & { className: string }) => React.ReactElement;
  variant?: 'primary' | 'secondary';
} & React.ComponentPropsWithoutRef<'button'>) {
  const props = { ...rest, className: `btn ${className ?? ''}` };
  return render ? render(props) : <button type="button" {...props} />;
}
export const x = <Button render={(p) => <a {...p} href="/pricing" />}>Pricing</Button>;
