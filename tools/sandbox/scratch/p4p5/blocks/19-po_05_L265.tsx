const a = useRef<HTMLAnchorElement>(null);
const d = useRef<HTMLDivElement>(null);

<Text>plain</Text>;                                        // OK  (span)
<Text as="a" href="/x" ref={a}>link</Text>;                // OK
<Text as="a" href="/x" ref={d}>link</Text>;                // ERROR: ref type mismatch (HTMLDivElement vs HTMLAnchorElement)
<Text as="span" href="/x">no</Text>;                       // ERROR: 'href' does not exist on span props
<Text as="input" size="lg" />;                             // OK: own `size` wins; input's numeric size is omitted
<Text size="xl">no</Text>;                                 // ERROR: not assignable to 'sm' | 'md' | 'lg'
<Text as="label" htmlFor="email">Email</Text>;             // OK
export {};
