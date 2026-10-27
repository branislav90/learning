export {};
// 🔴
const [state] = useState(readHugeLocalStorageJson()); // runs on EVERY render (result ignored after the first)
// ✅ lazy initializer
const [state] = useState(() => readHugeLocalStorageJson());
