// ProfileForm.tsx
import { useActionState } from 'react';

interface ProfileState {
  message: string | null;
  fieldErrors: { name?: string };
  name: string;
}

async function saveProfile(prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const name = String(formData.get('name') ?? '').trim();
  if (name.length < 2) {
    return { message: null, fieldErrors: { name: 'Name is too short' }, name };
  }
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) return { message: 'Could not save. Try again.', fieldErrors: {}, name };
  return { message: 'Saved!', fieldErrors: {}, name };
}

export function ProfileForm({ initialName }: { initialName: string }) {
  const [state, formAction, isPending] = useActionState<ProfileState, FormData>(saveProfile, {
    message: null,
    fieldErrors: {},
    name: initialName,
  });

  return (
    <form action={formAction}>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" defaultValue={state.name} aria-invalid={Boolean(state.fieldErrors.name)} />
      {state.fieldErrors.name && <p role="alert">{state.fieldErrors.name}</p>}
      <SubmitButton>Save</SubmitButton>
      {isPending && <span aria-live="polite">Working…</span>}
      {state.message && <p role="status">{state.message}</p>}
    </form>
  );
}
