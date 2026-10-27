type Channel = "email" | "sms" | "push";
type Sender = (to: string, body: string) => Promise<void>;
const senders: Record<Channel, Sender> = {
  email: async (to, body) => { /* … */ },
  sms: async (to, body) => { /* … */ },
  push: async (to, body) => { /* … */ },
};
export const send = (c: Channel, to: string, body: string) => senders[c](to, body);
export {};
