// Three components with the same styles — drift waiting to happen
function Button(props: React.ComponentPropsWithoutRef<'button'>) { return <button className="btn" {...props} />; }
function ButtonLink(props: React.ComponentPropsWithoutRef<'a'>) { return <a className="btn" {...props} />; }
function ButtonRouterLink(props: React.ComponentProps<typeof RouterLink>) { return <RouterLink className="btn" {...props} />; }
export {};
