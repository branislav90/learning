import { Component } from "react";

type Order = { id: string; customer: string; total: number; shipped: boolean };
type State = { orders: Order[]; loading: boolean; error: string | null };

class OrdersContainer extends Component<{}, State> {
  state: State = { orders: [], loading: true, error: null };
  private aborter = new AbortController();

  componentDidMount() {
    fetch("/api/orders", { signal: this.aborter.signal })
      .then((r) => r.json())
      .then((orders: Order[]) => this.setState({ orders, loading: false }))
      .catch((e) => {
        if (e.name !== "AbortError") this.setState({ error: String(e), loading: false });
      });
  }
  componentWillUnmount() { this.aborter.abort(); }

  markShipped = (id: string) => {
    this.setState((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, shipped: true } : o)) }));
    fetch(`/api/orders/${id}/ship`, { method: "POST" });
  };

  render() {
    return (
      <OrdersView
        orders={this.state.orders}
        loading={this.state.loading}
        error={this.state.error}
        onShip={this.markShipped}
      />
    );
  }
}
export {};
