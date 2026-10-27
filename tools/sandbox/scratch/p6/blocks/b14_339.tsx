// BAD 1: fetching in useEffect and expecting SSR to include it
function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { fetch('/api/orders').then(r => r.json()).then(setOrders); }, []);
  return <Table rows={orders} />;      // SSR HTML: empty table; user sees data only after JS+fetch
}

// BAD 2: singleton QueryClient shared across requests
const queryClient = new QueryClient();   // module scope, used on the server

// BAD 3: non-user-specific key for user-specific data
queryKey: ['orders']                      // same key for every user in a shared server cache

// BAD 4: raw JSON in a script tag
`<script>window.__DATA__ = ${JSON.stringify(data)}</script>`   // XSS if data contains "</script>"

// BAD 5: server waterfall
const user = await getUser(id);
const prefs = await getPrefs(id);        // independent of user, but serialised
const orders = await getOrders(id);

// BAD 6: leaking secrets to the client through props or dehydrated state
return <ClientPanel config={{ apiKey: process.env.API_KEY, ...publicConfig }} />;
export {};
