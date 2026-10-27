class BaseModal extends Component<{ open: boolean; onClose(): void }> {
  renderBody(): ReactNode { return null; }
  renderFooter(): ReactNode { return <button onClick={this.props.onClose}>Close</button>; }
  render() {
    if (!this.props.open) return null;
    return <div role="dialog"><div>{this.renderBody()}</div><div>{this.renderFooter()}</div></div>;
  }
}
class ConfirmModal extends BaseModal {
  renderBody() { return <p>Are you sure?</p>; }
  renderFooter() { return <><button>Yes</button><button onClick={this.props.onClose}>No</button></>; }
}
export {};
