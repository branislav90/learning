import { Component, type ReactNode } from "react";

abstract class BaseList<T, P = {}> extends Component<{ items: T[] } & P, { query: string }> {
  state = { query: "" };

  abstract renderItem(item: T): ReactNode;
  abstract matches(item: T, query: string): boolean;
  getKey(item: T, index: number): string | number { return index; }

  render() {
    const shown = this.props.items.filter((i) => this.matches(i, this.state.query));
    return (
      <div>
        <input
          value={this.state.query}
          onChange={(e) => this.setState({ query: e.target.value })}
        />
        <ul>
          {shown.map((item, i) => (
            <li key={this.getKey(item, i)}>{this.renderItem(item)}</li>
          ))}
        </ul>
      </div>
    );
  }
}

type User = { id: string; name: string };
class UserList extends BaseList<User> {
  renderItem(u: User) { return <b>{u.name}</b>; }
  matches(u: User, q: string) { return u.name.toLowerCase().includes(q.toLowerCase()); }
  getKey(u: User) { return u.id; }
}
export {};
