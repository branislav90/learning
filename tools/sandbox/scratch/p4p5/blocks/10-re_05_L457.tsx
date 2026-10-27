<ProductList
  products={products}
  showRating
  showWishlistButton
  badgeText={(p) => (p.stock < 5 ? "Low stock" : undefined)}
  priceFormat="compact"
  imagePosition="left"
  onCardClick={navigate}
  secondaryActionLabel="Compare"
  onSecondaryAction={compare}
/>
export {};
