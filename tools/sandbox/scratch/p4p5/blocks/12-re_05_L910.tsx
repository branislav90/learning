const [step, setStep] = useState(1);
const [data, setData] = useState<Data>({});
const [errors, setErrors] = useState<Record<string, string>>({});
const [submitting, setSubmitting] = useState(false);
function next() { /* validates step, setErrors, maybe setStep(step + 1) */ }
export {};
