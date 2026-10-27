export {};
// 🔴
function Signup() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [valid, setValid] = useState(false);

  useEffect(() => {
    setEmailError(/^\S+@\S+$/.test(email) ? '' : 'Invalid email');
  }, [email]);

  useEffect(() => {
    setValid(emailError === '');
  }, [emailError]);
  // ...
}
