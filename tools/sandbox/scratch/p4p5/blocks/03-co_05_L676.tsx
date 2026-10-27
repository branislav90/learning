function withLogging<P extends React.JSX.IntrinsicAttributes>(C: React.ComponentType<P>) {
  return function Wrapped(props: P) {
    console.log("render", C.name);
    return <C {...props} />;
  };
}
const Logged = withLogging(Button);
function App() { const L = withLogging(Button); return <L>hi</L>; }
export {};
