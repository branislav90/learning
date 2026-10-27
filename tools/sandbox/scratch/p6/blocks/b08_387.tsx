// ❌ C: fetching in useEffect "because I need to run something after"
useEffect(() => {
  queryClient.fetchQuery({ queryKey: ['x'], queryFn }).then(setX);
}, []);
export {};
