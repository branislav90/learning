type ButtonOwnProps = {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
};

type ButtonAsButton = ButtonOwnProps &
  Omit<React.ComponentPropsWithRef<'button'>, keyof ButtonOwnProps> & { href?: undefined };

type ButtonAsAnchor = ButtonOwnProps &
  Omit<React.ComponentPropsWithRef<'a'>, keyof ButtonOwnProps | 'href'> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant = 'primary', loading, className, children, ...anchorProps } = props;
    // anchors have no `disabled`; expose `loading` as aria-disabled and block the click
    return (
      <a
        {...anchorProps}
        className={cx('btn', `btn--${variant}`, className)}
        aria-disabled={loading || undefined}
        onClick={(e) => { if (loading) e.preventDefault(); else anchorProps.onClick?.(e); }}
      >
        {children}
      </a>
    );
  }
  const { variant = 'primary', loading, className, children, ...buttonProps } = props;
  return (
    <button type="button" {...buttonProps} className={cx('btn', `btn--${variant}`, className)} disabled={buttonProps.disabled || loading}>
      {children}
    </button>
  );
}
const cx = (...a: Array<string | false | undefined>) => a.filter(Boolean).join(' ');
export {};
