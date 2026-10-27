export {};
// 🔴 new promise every render
function Albums({ artistId }: { artistId: string }) {
  const albums = use(fetch(`/api/artists/${artistId}/albums`).then((r) => r.json()));
  return <AlbumList albums={albums} />;
}
