export {};
// 🔴
const renders = useRef(0);
renders.current += 1;                     // mutation in render: impure
return <p>{renders.current}</p>;          // output depends on a mutable not tracked by React
