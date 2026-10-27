class Socket {
  constructor() { console.log("open"); /* opens a connection */ }
  close() { console.log("close"); }
}
function Feed() {
  const [socket] = useState(() => new Socket());
  useEffect(() => () => socket.close(), [socket]);
  return null;
}
export {};
