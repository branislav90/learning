class Mouse extends React.Component<{ render: (p: { x: number; y: number }) => ReactNode }> {
  state = { x: 0, y: 0 };
  handleMove = (e: React.MouseEvent) => this.setState({ x: e.clientX, y: e.clientY });
  render() {
    return <div onMouseMove={this.handleMove}>{this.props.render(this.state)}</div>;
  }
}
export {};
