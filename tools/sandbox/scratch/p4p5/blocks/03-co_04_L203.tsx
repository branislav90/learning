// Before: ProductPage owns hover state used by one small tooltip
function ProductPage({ product }: { product: Product }) {
  const [tipOpen, setTipOpen] = useState(false);   // re-renders everything on hover
  return (
    <>
      <HeavyGallery images={product.images} />
      <button onMouseEnter={() => setTipOpen(true)} onMouseLeave={() => setTipOpen(false)}>Size guide</button>
      {tipOpen && <SizeTip />}
    </>
  );
}

// After: a component owns its own transient state
function SizeGuideButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>Size guide</button>
      {open && <SizeTip />}
    </>
  );
}
function ProductPage({ product }: { product: Product }) {
  return (<><HeavyGallery images={product.images} /><SizeGuideButton /></>);
}
export {};
