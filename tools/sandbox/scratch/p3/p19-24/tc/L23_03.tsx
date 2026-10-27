export {};
// 🔴
const [todos, setTodos] = useState<Todo[]>([]);
function toggle(i: number) {
  todos[i].done = !todos[i].done;
  setTodos(todos); // same reference → Object.is equal → React may bail out
}
