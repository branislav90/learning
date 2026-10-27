// contacts/UserCard.tsx
export function UserCard({ user, onMessage, onBlock }: {
  user: { name: string; email: string; avatarUrl: string; online: boolean };
  onMessage(): void;
  onBlock(): void;
}) {
  return (
    <CardFrame media={<><img src={user.avatarUrl} alt="" /><span className={user.online ? "dot dot--on" : "dot"} role="img" aria-label={user.online ? "Online" : "Offline"} /></>}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={onMessage}>Message</button>
      <button onClick={onBlock}>Block</button>
    </CardFrame>
  );
}
export {};
