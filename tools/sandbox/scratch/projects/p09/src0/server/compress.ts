// server/compress.ts
import zlib from 'node:zlib';
export function gzipStream() {
  // Without Z_SYNC_FLUSH, zlib buffers until its internal block fills, and the browser sees nothing for seconds.
  return zlib.createGzip({ flush: zlib.constants.Z_SYNC_FLUSH });
}
