function Page() {
  const state = useUsers((signal) => fetchUsers(signal));
  // ...
}
export {};
