export {};
// 🔴
useEffect(() => { setComment(''); }, [userId]); // one render with stale comment visible
// ✅
<Profile key={userId} userId={userId} />   // new identity = fresh state
