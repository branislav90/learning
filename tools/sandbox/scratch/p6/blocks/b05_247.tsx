function LikeButton({ postId, initial }: { postId: string; initial: boolean }) {
  const [liked, setLiked] = useState(initial);
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    try {
      await api.setLike(postId, !liked);
      setLiked(!liked);                     // UI changes only after the server confirmed
    } finally {
      setPending(false);
    }
  }
  return <button onClick={toggle} disabled={pending} aria-pressed={liked}>♥</button>;
}
export {};
