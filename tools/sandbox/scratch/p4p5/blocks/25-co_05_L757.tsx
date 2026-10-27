type Notification =
  | { id: string; read: boolean; type: "email"; from: string; subject: string }
  | { id: string; read: boolean; type: "mention"; by: string; room: string }
  | { id: string; read: boolean; type: "billing"; invoiceId: string; status: "paid" | "failed" };

function assertNever(x: never): never {
  throw new Error(`Unhandled notification: ${JSON.stringify(x)}`);
}
export {};
