// Configuration-prop smell: every new region becomes a new family of props.
<Card
  title="Invoice 42"
  titleIcon={<FileIcon />}
  titleSize="lg"
  subtitle="Due Friday"
  actionLabel="Pay"
  onAction={pay}
  actionVariant="primary"
  footerText="Net 30"
/>
export {};
