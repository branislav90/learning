function Uploader({ file }: { file: File }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  function start() {
    setUploading(true); setDone(false); setError(null); setCancelled(false); setProgress(0);
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.upload.onprogress = (e) => setProgress(e.loaded / e.total);   // fires after cancel?
    xhr.onload = () => { setUploading(false); setDone(true); };
    xhr.onerror = () => { setUploading(false); setError('Upload failed'); };
    xhr.open('POST', '/upload'); xhr.send(file);
  }
  function cancel() { xhrRef.current?.abort(); setUploading(false); setCancelled(true); }

  return (
    <div>
      {!uploading && !done && <button onClick={start}>{cancelled ? 'Restart' : 'Upload'}</button>}
      {uploading && <><progress value={progress} /><button onClick={cancel}>Cancel</button></>}
      {done && <p>Done</p>}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
export {};
