export function Disclosure({ children, ...opts }: DisclosureOptions & { children: (d: ReturnType<typeof useDisclosure>) => React.ReactNode }) {
  return <>{children(useDisclosure(opts))}</>;
}

// <Disclosure>{(d) => (<><button {...d.getTriggerProps()}>More</button><div {...d.getPanelProps()}>...</div></>)}</Disclosure>
export {};
