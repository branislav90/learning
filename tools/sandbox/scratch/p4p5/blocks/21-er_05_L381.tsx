type FormState =
  | { status: 'idle' }
  | { status: 'error'; fieldErrors: Partial<Record<'email' | 'name', string>> }
  | { status: 'success' };

async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get('email') ?? '');
  const res = await fetch('/api/signup', { method: 'POST', body: formData });
  if (res.status === 422) {
    const body = (await res.json()) as { errors: { email?: string; name?: string } };
    return { status: 'error', fieldErrors: body.errors };         // expected → data
  }
  if (!res.ok) throw new AppError(`Signup failed (${res.status})`, 'server', { retryable: res.status >= 500 }); // unexpected → boundary
  return { status: 'success' };
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUp, { status: 'idle' });
  const emailError = state.status === 'error' ? state.fieldErrors.email : undefined;
  return (
    <form action={action} noValidate>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" aria-invalid={!!emailError} aria-describedby={emailError ? 'email-err' : undefined} />
      {emailError && <p id="email-err" role="alert">{emailError}</p>}
      <button disabled={pending}>Create account</button>
    </form>
  );
}
export {};
