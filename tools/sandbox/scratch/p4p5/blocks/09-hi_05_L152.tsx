function Dashboard({ id }: { id: string }) {
  const Enhanced = withAuth(AdminPageBase);   // ❌ new component type each render
  return <Enhanced reportId={id} />;
}
export {};
