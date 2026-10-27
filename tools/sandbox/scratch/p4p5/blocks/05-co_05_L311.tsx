function Settings() {
  return (
    <Tabs defaultValue="billing">
      <Tabs.List aria-label="Settings sections">
        <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Panel value="profile"><ProfileForm /></Tabs.Panel>
      <Tabs.Panel value="billing"><BillingForm /></Tabs.Panel>
    </Tabs>
  );
}
export {};
