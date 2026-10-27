async function load(id: string) {
  const res = await fetch(`/api/items/${id}`);
  setItem(await res.json());   // "obviously this is the item for id"
}
export {};
