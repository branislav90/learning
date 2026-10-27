function ChannelEditor({ channel, value, onChange }: Props) {
  const label = channel === 'email' ? 'Email address' : channel === 'sms' ? 'Phone number' : 'Device token';
  const valid =
    channel === 'email' ? /^\S+@\S+$/.test(value)
    : channel === 'sms' ? /^\+\d{7,15}$/.test(value)
    : value.length === 64;
  return (
    <div>
      <label>{label}<input value={value} onChange={(e) => onChange(e.target.value)} /></label>
      {!valid && <p role="alert">Invalid {channel}</p>}
      {channel === 'email' && <EmailPreview address={value} />}
      {channel === 'sms' && <SmsPreview number={value} />}
      {channel === 'push' && <PushPreview token={value} />}
    </div>
  );
}
export {};
