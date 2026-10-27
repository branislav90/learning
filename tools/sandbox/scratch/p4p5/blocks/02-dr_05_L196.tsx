function UserRow({ u }: { u: User })    { return <li className="row"><b>{u.name}</b> <span>{u.email}</span></li>; }
function ProductRow({ p }: { p: Product }) { return <li className="row"><b>{p.title}</b> <span>{p.sku}</span></li>; }
export {};
