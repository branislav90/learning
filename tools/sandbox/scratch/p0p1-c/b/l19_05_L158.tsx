export {};
// Recommended: plain function with typed props.
interface GreetingProps { name: string; excited?: boolean }
export function Greeting({ name, excited = false }: GreetingProps) {
  return <p>Hello, {name}{excited ? "!" : "."}</p>;
}
