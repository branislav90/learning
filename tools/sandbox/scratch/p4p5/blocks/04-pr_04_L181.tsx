// Presentational: props only
interface AvatarProps { src: string; name: string; size?: number }
export function Avatar({ src, name, size = 32 }: AvatarProps) {
  return <img src={src} alt={name} width={size} height={size} style={{ borderRadius: "50%" }} />;
}

// Data-aware wrapper (container) - knows where the user comes from
export function CurrentUserAvatar() {
  const user = useCurrentUser();           // ambient dependency lives here
  if (!user) return null;
  return <Avatar src={user.avatarUrl} name={user.name} />;
}
export {};
