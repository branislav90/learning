<Tabs
  items={[
    { id: "profile", label: "Profile", icon: <UserIcon />, content: <ProfileForm />, disabled: false },
    { id: "billing", label: "Billing", badge: 2, content: <BillingForm /> },
  ]}
  renderLabel={(item) => …}
  renderPanel={(item) => …}
  labelClassName="…"
  panelClassName="…"
  showBadges
/>
export {};
