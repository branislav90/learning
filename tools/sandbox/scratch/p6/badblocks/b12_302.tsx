// BAD 1: boolean soup (the problem machines solve)
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [retrying, setRetrying] = useState(false);
const [cancelled, setCancelled] = useState(false);
// loading && error && cancelled? Who knows.

// BAD 2: machine used as a data store
context: { products: [] as Product[], page: 1, filters: {}, selectedIds: [] }
// events: PRODUCTS_LOADED, FILTER_CHANGED ... a store/query cache in disguise

// BAD 3: side effects in guards or reducers
guards: { canRetry: ({ context }) => { logAnalytics('guard'); return context.attempts < 3; } }

// BAD 4: creating the actor in the component body
function C() { const actor = createActor(machine).start(); /* new actor every render, never stopped */ }

// BAD 5: v4 snippet in a v5 project
import { Machine, interpret } from 'xstate';    // Machine/interpret removed in v5
export {};
