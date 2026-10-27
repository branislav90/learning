// ❌ B: copying query data into state
function Profile() {
  const { data } = useQuery({ queryKey: ['me'], queryFn: fetchMe });
  const [name, setName] = useState(data?.name ?? '');   // initial render: data undefined → ''
  ...
}
export {};
