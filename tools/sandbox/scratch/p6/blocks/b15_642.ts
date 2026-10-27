async function save(data: Data) {
  for (let i = 0; i < 3; i++) {
    try { return await post('/save', data); } catch {}
  }
}
export {};
