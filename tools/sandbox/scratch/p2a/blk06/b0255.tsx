function Page({ compact }: { compact: boolean }) {
  return compact ? <section><Form /></section> : <div><Form /></div>;
}
