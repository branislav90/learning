import { useDispatch, useSelector } from "react-redux";
import { selectVisibleTodos, toggleTodo } from "./todosSlice";
import type { AppDispatch, RootState } from "../store";

export function TodosContainer() {
  const todos = useSelector((s: RootState) => selectVisibleTodos(s));
  const dispatch = useDispatch<AppDispatch>();
  return <Todos todos={todos} onToggle={(id) => dispatch(toggleTodo(id))} />;
}
export {};
