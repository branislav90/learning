export function useRegisterCommand(cmd: AppCommand) {
  const ref = useRef(cmd);
  useEffect(() => { ref.current = cmd; });
  useEffect(
    () => commandRegistry.register({ ...cmd, run: (ctx) => ref.current.run(ctx), when: cmd.when && ((ctx) => ref.current.when!(ctx)) }),
    [cmd.id, cmd.title, cmd.shortcut],           // identity of the registration, not of the closures
  );
}
export {};
