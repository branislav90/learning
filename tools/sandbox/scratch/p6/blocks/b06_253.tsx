function ProjectTitle({ project }: { project: { id: string; name: string } }) {
  const [name, setName] = useState(project.name);   // copied once at mount
  return <h1>{name}</h1>;                            // never follows later prop changes
}
export {};
