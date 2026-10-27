export function useMaybeUser(enabled: boolean) {
  if (!enabled) return null;                 // early return BEFORE hooks
  const [user] = useState(...);               // hook order changes between renders
  return user;
}
export {};
