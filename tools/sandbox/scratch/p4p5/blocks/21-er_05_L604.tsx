import { useCallback, useState } from 'react';

export function useAsyncError() {
  const [, setState] = useState();
  return useCallback((error: unknown) => {
    setState(() => { throw error; });
  }, []);
}
export {};
