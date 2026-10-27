import type { ComponentType, ReactNode } from "react";

// (A) Slot as an ELEMENT (ReactNode): caller decides props; the slot is "already created"
type CardPropsA = { title: string; icon?: ReactNode };
export function CardA({ title, icon }: CardPropsA) {
  return <header>{icon}<h3>{title}</h3></header>;
}
// <CardA title="Billing" icon={<CreditCardIcon size={16} aria-hidden />} />

// (B) Slot as a COMPONENT TYPE: the Card decides props and when to render it
type IconProps = { size: number };
type CardPropsB = { title: string; Icon?: ComponentType<IconProps> };
export function CardB({ title, Icon }: CardPropsB) {
  return <header>{Icon && <Icon size={16} />}<h3>{title}</h3></header>;
}
// <CardB title="Billing" Icon={CreditCardIcon} />
