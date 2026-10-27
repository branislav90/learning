import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();          // must be rendered inside the <form>
  return <button type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>;
}

type FormState = { ok: boolean; message: string | null; fieldErrors?: Record<string, string> };

async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const res = await fetch('/api/profile', { method: 'POST', body: formData });
  if (res.status === 422) {
    const body = (await res.json()) as { errors: Record<string, string> };
    return { ok: false, message: null, fieldErrors: body.errors };   // validation => state, not exception
  }
  if (!res.ok) return { ok: false, message: 'Could not save. Try again.' };
  return { ok: true, message: 'Saved.' };
}

export function ProfileForm() {
  const [state, formAction] = useActionState(saveProfile, { ok: false, message: null });
  return (
    <form action={formAction}>
      <input name="displayName" aria-invalid={Boolean(state.fieldErrors?.displayName)} />
      {state.fieldErrors?.displayName && <p role="alert">{state.fieldErrors.displayName}</p>}
      <SubmitButton />
      <p role="status">{state.message}</p>
    </form>
  );
}
export {};
