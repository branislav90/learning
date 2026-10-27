type Props = {
  children: React.ReactNode;
  isLink?: boolean; href?: string; external?: boolean;
  isRouterLink?: boolean; to?: string;
  onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean;
};
function Button({ isLink, href, external, isRouterLink, to, children, ...rest }: Props) {
  if (isRouterLink) return <RouterLink to={to!} className="btn">{children}</RouterLink>;     // non-null assertion
  if (isLink) return <a href={href} className="btn" {...(external ? { target: '_blank' } : {})}>{children}</a>;   // missing rel
  return <button className="btn" {...rest}>{children}</button>;
}
export {};
