function F({ initial }: { initial?: string }) {
  return <input value={initial} onChange={() => {}} />;
}
// <F />  then later  <F initial="hi" />
export {};
