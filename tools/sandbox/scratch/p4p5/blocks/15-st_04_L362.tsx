function UserForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name);
  useEffect(() => { setName(user.name); }, [user]);        // "keep in sync"
  // ...
}
export {};
