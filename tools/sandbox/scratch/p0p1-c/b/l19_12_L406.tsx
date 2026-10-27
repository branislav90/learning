export {};
type Status = "draft" | "published";
const opts = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
] as const;                                   // literals preserved

const [status, setStatus] = useState<Status>("draft");
<Select value={status} options={opts} onChange={setStatus} />
