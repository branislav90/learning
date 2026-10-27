type ButtonTag = 'button' | 'a';

type PolyButtonProps<C extends ButtonTag> = PolymorphicProps<C, ButtonOwnProps> &
  (C extends 'a' ? { href: string } : { href?: never });

export function PolyButton<C extends ButtonTag = 'button'>(props: PolyButtonProps<C>) { /* as in 5.5, branching on props.as */ return null; }
export {};
