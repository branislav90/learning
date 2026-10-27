// main.tsx
import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")!).render(<App />);

function App() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { fetchUser().then(setUser); }, []);
  return user ? <Profile user={user} /> : <p>Loading…</p>;
}
export {};
