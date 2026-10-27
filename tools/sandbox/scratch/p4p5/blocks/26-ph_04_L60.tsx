class Boundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p>Oops</p> : this.props.children; }
}

function Boom(): React.ReactNode { throw new Error("x"); }

function App() {
  return (
    <>
      <Boundary>
        <header>H</header>
        <Boom />
      </Boundary>
      <footer>F</footer>
    </>
  );
}
export {};
