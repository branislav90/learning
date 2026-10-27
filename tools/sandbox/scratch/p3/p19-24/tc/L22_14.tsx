const albumCache = new Map<string, Promise<Album[]>>();

export function fetchAlbums(artistId: string): Promise<Album[]> {
  let p = albumCache.get(artistId);
  if (!p) {
    p = fetch(`/api/artists/${artistId}/albums`).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json() as Promise<Album[]>;
    });
    albumCache.set(artistId, p);
  }
  return p;
}

function Albums({ artistId }: { artistId: string }) {
  const albums = use(fetchAlbums(artistId)); // same promise for the same artistId
  return <AlbumList albums={albums} />;
}

export function ArtistPage({ artistId }: { artistId: string }) {
  return (
    <ErrorBoundary fallback={<p>Couldn't load albums.</p>}>
      <Suspense fallback={<AlbumsSkeleton />}>
        <Albums artistId={artistId} />
      </Suspense>
    </ErrorBoundary>
  );
}
