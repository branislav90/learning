export const browserGeolocation: GeoPort = {
  current(signal) {
    return new Promise((resolve, reject) => {
      if (signal.aborted) return reject(new DOMException('Aborted', 'AbortError'));
      if (!('geolocation' in navigator)) return reject(new Error('Geolocation unsupported'));
      const onAbort = () => reject(new DOMException('Aborted', 'AbortError'));
      signal.addEventListener('abort', onAbort, { once: true });
      navigator.geolocation.getCurrentPosition(
        (p) => { signal.removeEventListener('abort', onAbort); resolve({ lat: p.coords.latitude, lon: p.coords.longitude }); },
        (e) => { signal.removeEventListener('abort', onAbort); reject(new Error(e.code === e.PERMISSION_DENIED ? 'Location permission denied' : e.message)); },
        { timeout: 10_000 },
      );
    });
  },
};
export {};
