type ViewAction =
  | { type: "query"; value: string }
  | { type: "sort"; value: Sort }
  | { type: "page"; delta: 1 | -1 };

function viewReducer(v: View, a: ViewAction): View {
  switch (a.type) {
    case "query": return { ...v, query: a.value, page: 1 };       // invariant: reset page
    case "sort":  return { ...v, sort: a.value, page: 1 };
    case "page":  return { ...v, page: Math.max(1, v.page + a.delta) };
  }
}
export {};
