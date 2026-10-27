type DisclosureState = { open: boolean };
type DisclosureAction = { type: 'toggle' | 'open' | 'close' | 'escape' | 'outside-click' };

type Reducer = (state: DisclosureState, action: DisclosureAction, defaultNext: DisclosureState) => DisclosureState;

function useDisclosureWithReducer(opts: { reducer?: Reducer }) {
  const [state, dispatch] = useReducer(
    (s: DisclosureState, a: DisclosureAction): DisclosureState => {
      const defaultNext: DisclosureState =
        a.type === 'toggle' ? { open: !s.open } :
        a.type === 'open' ? { open: true } : { open: false };
      return opts.reducer ? opts.reducer(s, a, defaultNext) : defaultNext;
    },
    { open: false },
  );
  return { state, dispatch };
}
// consumer: "do not close on outside click while the form is dirty"
// reducer: (s, a, next) => (a.type === 'outside-click' && dirty ? s : next)
export {};
