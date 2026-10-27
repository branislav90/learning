// React 19: context as provider; ref callback cleanup
const ThemeContext = createContext<"light" | "dark">("light");

function App() {
  return (
    <ThemeContext value="dark">
      <input ref={(el) => {
        el?.focus();
        return () => { /* cleanup when the element is removed */ };
      }} />
    </ThemeContext>
  );
}
export {};
