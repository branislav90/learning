export {};
// 🔴
function Name({ name }: { name: string }) {
  const [value, setValue] = useState(name); // ignores later `name` changes
  ...
}
