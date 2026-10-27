function AddToCartButton({ sku }: { sku: string }) {
  const analytics = useAnalytics();
  return (
    <Button onClick={() => { analytics.track("add_to_cart", { sku }); /* … */ }}>
      Add
    </Button>
  );
}
export {};
