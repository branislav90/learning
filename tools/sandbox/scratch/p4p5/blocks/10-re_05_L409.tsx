<Disclosure>
  {({ open, toggle }) => (
    <>
      <button aria-expanded={open} onClick={toggle}>Filters</button>
      {open && <FilterPanel />}
    </>
  )}
</Disclosure>
export {};
