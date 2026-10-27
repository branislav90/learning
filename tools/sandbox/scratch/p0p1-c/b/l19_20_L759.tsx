export {};
interface Props { items: readonly string[]; render: (s: string) => React.ReactNode }
declare function Foo(props: Props): React.ReactNode;
<Foo items={["a"]} render={(s) => s.toUpperCase()} />;
<Foo items={["a"]} render={(n: number) => n} />;
<Foo items={[1]} render={(s) => s} />;
