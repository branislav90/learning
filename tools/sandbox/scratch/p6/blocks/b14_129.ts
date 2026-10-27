// BAD on a server
export const queryClient = new QueryClient();       // shared by all requests
export const store = configureStore({ reducer });    // shared by all requests
export const useSession = create(() => ({ user: null }));
export {};
