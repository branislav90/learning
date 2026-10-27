export {};
const [items, setItems] = useState<string[]>([]);
function add() { items.push('x'); setItems(items); }
