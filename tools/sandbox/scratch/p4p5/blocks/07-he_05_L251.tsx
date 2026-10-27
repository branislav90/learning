type Country = { code: string; name: string; flag: string };

// Skin 1: dense list for an admin form
function CountryListbox({ countries, value, onChange }: {
  countries: Country[]; value: string | null; onChange: (c: string | null) => void;
}) {
  const { getListboxProps, getOptionProps } = useListbox({
    items: countries, getKey: (c) => c.code, value, onValueChange: onChange,
  });
  return (
    <ul {...getListboxProps({ "aria-label": "Country", className: "admin-list" })}>
      {countries.map((c, i) => (
        <li key={c.code} {...getOptionProps(i, { className: "admin-row" })}>
          {c.name}
        </li>
      ))}
    </ul>
  );
}

// Skin 2: card grid for a marketing page. Same behaviour, different DOM.
function CountryCards({ countries }: { countries: Country[] }) {
  const { getListboxProps, getOptionProps, selectedKey } = useListbox({
    items: countries, getKey: (c) => c.code,
  });
  return (
    <div {...getListboxProps({ "aria-label": "Choose your country", className: "card-grid" })}>
      {countries.map((c, i) => (
        <div key={c.code} {...getOptionProps(i, { className: "card" })}>
          <span aria-hidden>{c.flag}</span>
          <strong>{c.name}</strong>
          {selectedKey === c.code && <span className="badge">Selected</span>}
        </div>
      ))}
    </div>
  );
}
export {};
