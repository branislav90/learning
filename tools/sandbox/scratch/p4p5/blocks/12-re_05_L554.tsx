type FormState = { status: "idle" } | { status: "error"; message: string } | { status: "success" };

async function subscribeAction(prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  if (!email.includes("@")) return { status: "error", message: "Enter a valid email" };
  await api.subscribe(email);                              // side effects ARE allowed in an Action
  return { status: "success" };
}

function SubscribeForm() {
  const [state, formAction, isPending] = useActionState(subscribeAction, { status: "idle" });
  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <button disabled={isPending}>Subscribe</button>
      {state.status === "error" && <p role="alert">{state.message}</p>}
      {state.status === "success" && <p>Subscribed!</p>}
    </form>
  );
}
export {};
