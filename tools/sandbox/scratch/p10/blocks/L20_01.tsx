export {};
function Bomb({ mode }: { mode: 'render' | 'click' | 'timer' | 'promise' }) {
  const [n, setN] = useState(0);
  if (mode === 'render' && n === 0) throw new Error('render');
  return (
    <button
      onClick={() => {
        if (mode === 'click') throw new Error('click');
        if (mode === 'timer') setTimeout(() => { throw new Error('timer'); }, 0);
        if (mode === 'promise') Promise.reject(new Error('promise'));
        setN(1);
      }}
    >
      go {n}
    </button>
  );
}
