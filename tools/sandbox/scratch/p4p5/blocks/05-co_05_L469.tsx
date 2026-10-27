function BillingTab() { return <Tab id="b" label="Billing" />; }   // a wrapper

<BrokenTabs>
  <Tab id="a" label="A" />
  <BillingTab />                          {/* receives selected/onSelect as props, ignores them */}
  {isAdmin && <Tab id="c" label="Admin" />}  {/* `false` is skipped fine; but... */}
  <>
    <Tab id="d" label="D" />               {/* inside a fragment: not cloned */}
  </>
</BrokenTabs>
export {};
