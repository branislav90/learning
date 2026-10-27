const channels = {
  email: { label: 'Email address', isValid: (v: string) => /^\S+@\S+$/.test(v), Preview: EmailPreviewAdapter },
  sms:   { label: 'Phone number',  isValid: (v: string) => /^\+\d{7,15}$/.test(v), Preview: SmsPreviewAdapter },
  push:  { label: 'Device token',  isValid: (v: string) => v.length === 64,        Preview: PushPreviewAdapter },
} as const satisfies Record<string, {
  label: string; isValid: (v: string) => boolean; Preview: ComponentType<{ value: string }>;
}>;
type Channel = keyof typeof channels;

function ChannelEditor({ channel, value, onChange }: { channel: Channel; value: string; onChange: (v: string) => void }) {
  const { label, isValid, Preview } = channels[channel];
  return (
    <div>
      <label>{label}<input value={value} onChange={(e) => onChange(e.target.value)} /></label>
      {!isValid(value) && <p role="alert">Invalid {channel}</p>}
      <Preview value={value} />
    </div>
  );
}
export {};
