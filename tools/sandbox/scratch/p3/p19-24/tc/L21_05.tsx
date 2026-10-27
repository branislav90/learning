export function SignupForm({ onSubmitToServer }: {
  onSubmitToServer: (v: SignupValues) => Promise<{ ok: true } | { ok: false; fieldErrors: Errors; message: string }>;
}) {
  const [state, dispatch] = useReducer(reducer, initial);
  const refs = {
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
  };

  // Derived, not stored:
  const clientErrors = validate(state.values);
  const serverErrors = state.status.kind === 'failed' ? state.status.fieldErrors : {};
  const errors: Errors = { ...clientErrors, ...serverErrors }; // server overrides while present
  const isValid = Object.keys(clientErrors).length === 0;
  const show = (f: keyof SignupValues) => (state.touched[f] || state.submitCount > 0) && errors[f];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.status.kind === 'submitting') return; // duplicate-submit guard
    dispatch({ type: 'submitAttempt' });
    if (!isValid) {
      const firstInvalid = (['email', 'password'] as const).find((f) => clientErrors[f]);
      if (firstInvalid) refs[firstInvalid].current?.focus();
      return;
    }
    dispatch({ type: 'submitStart' });
    try {
      const result = await onSubmitToServer(state.values);
      if (result.ok) dispatch({ type: 'submitSuccess' });
      else dispatch({ type: 'submitFailure', message: result.message, fieldErrors: result.fieldErrors });
    } catch {
      dispatch({ type: 'submitFailure', message: 'Network error. Try again.', fieldErrors: {} });
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          ref={refs.email}
          value={state.values.email}
          onChange={(e) => dispatch({ type: 'change', field: 'email', value: e.target.value })}
          onBlur={() => dispatch({ type: 'blur', field: 'email' })}
          aria-invalid={Boolean(show('email'))}
          aria-describedby={show('email') ? 'email-error' : undefined}
          autoComplete="email"
        />
        {show('email') && <p id="email-error" role="alert">{errors.email}</p>}
      </div>
      {/* password field analogous */}
      <button type="submit" disabled={state.status.kind === 'submitting'}>
        {state.status.kind === 'submitting' ? 'Creating…' : 'Create account'}
      </button>
      {state.status.kind === 'failed' && <p role="alert">{state.status.message}</p>}
    </form>
  );
}
