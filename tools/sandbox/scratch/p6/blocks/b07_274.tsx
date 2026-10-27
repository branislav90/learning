function ProjectName({ id }: { id: string }) {
  const [state, setState] = useState<AsyncState<Project>>({ status: 'loading' }); // lesson 01
  useEffect(() => { /* fetch, abort, parse, status — ~25 lines (lesson 01 §5.2) */ }, [id]);
  /* ... */
}
// <ProjectName id="42" /> rendered in header, sidebar and breadcrumb ⇒ 3 requests, 3 loading states,
// three copies that can disagree after an edit.
export {};
