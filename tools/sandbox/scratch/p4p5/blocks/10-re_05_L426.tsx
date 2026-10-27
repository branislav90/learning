class FetchJson<T> extends React.Component<{ url: string; children: (s: State<T>) => ReactNode }, State<T>> {
  state: State<T> = { status: "pending" };
  componentDidMount() { this.load(); }
  componentDidUpdate(prev: { url: string }) { if (prev.url !== this.props.url) this.load(); }
  load() { /* fetch, setState, no cancellation */ }
  render() { return this.props.children(this.state); }
}

<FetchJson<User> url={`/api/users/${id}`}>
  {(s) => s.status === "pending" ? <Spinner /> : s.status === "error" ? <Error /> : <Profile user={s.data} />}
</FetchJson>
export {};
