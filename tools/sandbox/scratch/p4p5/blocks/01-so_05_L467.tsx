// Before: Avatar depends on the whole User
function Avatar({ user }: { user: User }) {
  return <img src={user.profile.photo.url} alt={`${user.firstName} ${user.lastName}`} />;
}
// After
function Avatar({ src, name }: { src: string; name: string }) {
  return <img src={src} alt={name} width={32} height={32} />;
}
export {};
