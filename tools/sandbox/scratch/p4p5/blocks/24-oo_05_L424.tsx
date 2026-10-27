class UploadService {
  constructor(private readonly client: Fetcher) {}
  async upload(file: File, onProgress: (n: number) => void, signal: AbortSignal) { /* … */ }
}

function useUpload() {
  const client = use(ApiContext);                       // injected
  const service = useMemo(() => new UploadService(client), [client]);
  const [state, setState] = useState<{ status: "idle" | "uploading" | "done" | "error"; progress: number }>({ status: "idle", progress: 0 });
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(async (file: File) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setState({ status: "uploading", progress: 0 });
    try {
      await service.upload(file, (n) => setState({ status: "uploading", progress: n }), ctrl.signal);
      if (!ctrl.signal.aborted) setState({ status: "done", progress: 100 });
    } catch { if (!ctrl.signal.aborted) setState({ status: "error", progress: 0 }); }
  }, [service]);

  useEffect(() => () => abortRef.current?.abort(), []);
  return { ...state, start };
}
export {};
