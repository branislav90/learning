// Redux-style, hand-written
function ProjectsScreen() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s: RootState) => s.projects);

  useEffect(() => {
    dispatch({ type: 'projects/loading' });
    fetch('/api/projects').then(r => r.json())
      .then(data => dispatch({ type: 'projects/loaded', payload: data }))
      .catch(e => dispatch({ type: 'projects/failed', payload: String(e) }));
  }, [dispatch]);

  if (loading) return <Spinner />;
  /* ... */
}
export {};
