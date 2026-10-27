export {};
// 🔴
const [submitted, setSubmitted] = useState(false);
useEffect(() => {
  if (submitted) { api.post(form); setSubmitted(false); }
}, [submitted]);
<button onClick={() => setSubmitted(true)} />
