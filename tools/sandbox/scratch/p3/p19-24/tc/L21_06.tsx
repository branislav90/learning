import { useActionState } from 'react';

interface ContactState {
  status: 'idle' | 'error' | 'success';
  values: { email: string; message: string };
  errors: Partial<Record<'email' | 'message', string>>;
}

const initialContact: ContactState = {
  status: 'idle',
  values: { email: '', message: '' },
  errors: {},
};

async function sendContact(prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    email: String(formData.get('email') ?? '').trim(),
    message: String(formData.get('message') ?? '').trim(),
  };
  const errors: ContactState['errors'] = {};
  if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = 'Enter a valid email';
  if (values.message.length < 10) errors.message = 'Tell us a bit more (10+ chars)';
  if (Object.keys(errors).length > 0) return { status: 'error', values, errors };

  const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(values),
    headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) return { status: 'error', values, errors: { message: 'Server rejected the message' } };
  return { status: 'success', values: { email: '', message: '' }, errors: {} };
}

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContact, initialContact);

  return (
    <form action={formAction}>
      <label htmlFor="c-email">Email</label>
      <input
        id="c-email"
        name="email"
        type="email"
        defaultValue={state.values.email}
        aria-invalid={Boolean(state.errors.email)}
        aria-describedby={state.errors.email ? 'c-email-err' : undefined}
        key={`email-${state.status}-${state.values.email}`}
      />
      {state.errors.email && <p id="c-email-err">{state.errors.email}</p>}

      <label htmlFor="c-msg">Message</label>
      <textarea id="c-msg" name="message" defaultValue={state.values.message}
        aria-invalid={Boolean(state.errors.message)} />
      {state.errors.message && <p role="alert">{state.errors.message}</p>}

      <button type="submit" disabled={isPending}>{isPending ? 'Sending…' : 'Send'}</button>
      {state.status === 'success' && <p role="status">Thanks! We'll reply soon.</p>}
    </form>
  );
}
