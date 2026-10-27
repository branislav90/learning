import { useActionState } from "react";
export function C() {
  const [state, action] = useActionState(async (formData: FormData) => { return { ok: true }; }, { ok: false });
  return <form action={action}></form>;
}
