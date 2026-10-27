import { createContext, memo, use, useState } from "react";

const ThemeContext = createContext<"light" | "dark">("light");

const Panel = memo(function Panel() {
  console.log("Panel render");            // no props, memoized
  return <Themed />;
});

function Themed() {
  const theme = use(ThemeContext);        // consumer
  console.log("Themed render", theme);
  return <div className={theme}>content</div>;
}

export function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <ThemeContext value={theme}>
      <button onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>toggle</button>
      <Panel />
    </ThemeContext>
  );
}
