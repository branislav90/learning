const UploadCtx = createContext<ActorRefFrom<typeof uploadMachine> | null>(null);
// provider: const ref = useActorRef(uploadMachine); <UploadCtx value={ref}>…</UploadCtx>
// consumer: const ref = use(UploadCtx)!; const progress = useSelector(ref, s => s.context.progress);
export {};
