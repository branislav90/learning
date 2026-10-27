export {};
// Message: "Read our <link>privacy policy</link> before continuing."
function RichText({ id, tags }: { id: string; tags: Record<string, (children: ReactNode) => ReactNode> }) {
  const { t } = useI18n();
  const raw = t(id);
  const parts = raw.split(/(<\w+>.*?<\/\w+>)/g);       // simple, non-nested tag support (teaching only)
  return <>{parts.map((part, i) => {
    const m = /^<(\w+)>(.*)<\/\1>$/.exec(part);
    return m && tags[m[1]!] ? <Fragment key={i}>{tags[m[1]!]!(m[2])}</Fragment> : part;
  })}</>;
}

<RichText id="consent.text" tags={{ link: (c) => <a href="/privacy">{c}</a> }} />
