function Uploader({ file }: { file: File }) {
  const [state, dispatch] = useReducer(uploadReducer, { status: 'idle', runs: 0 });
  const activeRun = state.status === 'uploading' ? state.runs : null;

  useEffect(() => {
    if (activeRun === null) return;
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) dispatch({ type: 'PROGRESS', fraction: e.loaded / e.total }); };
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300
      ? dispatch({ type: 'LOADED' })
      : dispatch({ type: 'FAILED', message: `Server responded ${xhr.status}` });
    xhr.onerror = () => dispatch({ type: 'FAILED', message: 'Network error' });
    xhr.open('POST', '/upload');
    xhr.send(file);
    return () => xhr.abort();           // CANCEL, FAILED, LOADED, or unmount all end here
  }, [activeRun, file]);

  /* render: switch (state.status) ... "Cancel" dispatches { type: 'CANCEL' } */
}
export {};
