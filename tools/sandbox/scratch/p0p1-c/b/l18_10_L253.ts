export {};
function h(o: { v: string | undefined }) {
  if (o.v !== undefined) {
    mutate(o);          // TS assumes o.v is still narrowed (it does not model side effects)
    o.v.length;         // compiles; may crash at runtime
  }
}
