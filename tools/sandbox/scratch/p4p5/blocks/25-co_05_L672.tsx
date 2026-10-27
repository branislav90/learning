type SignUpState = { status: "idle" } | { status: "success" } | { status: "error"; message: string; email: string };

async function signUpAction(_prev: SignUpState, formData: FormData): Promise<SignUpState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { status: "error", message: "Enter a valid email", email };
  try {
    await createAccount(email, { idempotencyKey: crypto.randomUUID() });
    return { status: "success" };
  } catch (err) {
    return { status: "error", message: err instanceof Error ? err.message : "Failed", email };
  }
}

function SignUp() {
  const [state, action, pending] = useActionState(signUpAction, { status: "idle" } as SignUpState);
  return (
    <form action={action}>
      <input name="email" type="email" defaultValue={state.status === "error" ? state.email : ""} required />
      <button disabled={pending}>Create</button>
      {state.status === "success" && <p role="status">Welcome!</p>}
      {state.status === "error" && <p role="alert">{state.message}</p>}
    </form>
  );
}
export {};
