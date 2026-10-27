type FormState =
  | { status: "idle"; email: string }
  | { status: "submitting"; email: string }
  | { status: "success"; email: string }
  | { status: "error"; email: string; message: string };
export {};
